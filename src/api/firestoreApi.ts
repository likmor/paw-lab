import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { notificationService } from "../config";
import type {
  Project,
  ProjectModel,
  Story,
  StoryModel,
  Task,
  TaskModel,
  User,
} from "../types";
import type { AppApi } from "./api";

const projects = () => collection(db, "projects");
const stories = (projectId: string) =>
  collection(db, "projects", projectId, "stories");
const tasks = (projectId: string, storyId: string) =>
  collection(db, "projects", projectId, "stories", storyId, "tasks");
const users = () => collection(db, "users");

function mapDoc<T>(d: any): T {
  return { id: d.id, ...d.data() } as T;
}

export class FirestoreApi implements AppApi {
  async getProjects(): Promise<Project[]> {
    const snap = await getDocs(projects());
    return snap.docs.map(mapDoc<Project>);
  }

  async getProject(id: string): Promise<Project | null> {
    const snap = await getDoc(doc(db, "projects", id));
    return snap.exists() ? mapDoc<Project>(snap) : null;
  }

  async createProject(model: ProjectModel): Promise<Project> {
    const ref = await addDoc(projects(), model);
    const project: Project = { id: ref.id, ...model };

    const admins = (await this.getUsers()).filter((u) => u.role === "admin");
    await Promise.all(
      admins.map((u) =>
        notificationService.send({
          title: "New project created",
          message: `Project "${model.title}" has been created.`,
          priority: "high",
          recipientId: u.id,
        }),
      ),
    );

    return project;
  }

  async updateProject(project: Project): Promise<void> {
    const { id, ...data } = project;
    await updateDoc(doc(db, "projects", id), data);
  }

  async deleteProject(projectId: string): Promise<void> {
    const projectStories = await this.getStories(projectId);
    await Promise.all(
      projectStories.map((s) => this.deleteStory(projectId, s.id)),
    );
    await deleteDoc(doc(db, "projects", projectId));
  }

  async setActiveProject(id: string, userId: string) {
    await updateDoc(doc(db, "users", userId), { activeProject: id });
  }

  async deleteActiveProject(userId: string) {
    await updateDoc(doc(db, "users", userId), {
      activeProject: deleteField(),
    });
  }

  async getActiveProject(userId: string): Promise<string | null> {
    const snap = await getDoc(doc(db, "users", userId));
    if (!snap.exists()) return null;
    
    return snap.data().activeProject;
  }

  async getStories(projectId: string): Promise<Story[]> {
    const snap = await getDocs(stories(projectId));
    return snap.docs.map(mapDoc<Story>);
  }

  async getStory(projectId: string, storyId: string): Promise<Story | null> {
    const snap = await getDoc(
      doc(db, "projects", projectId, "stories", storyId),
    );
    return snap.exists() ? mapDoc<Story>(snap) : null;
  }

  async createStory(
    model: StoryModel,
    projectId: string,
    ownerID: string,
  ): Promise<Story> {
    const data = {
      ...model,
      projectId,
      ownerId: ownerID,
      state: "todo",
      createdAt: Date.now().toString(),
    };
    const ref = await addDoc(stories(projectId), data);
    return { id: ref.id, ...data } as Story;
  }

  async updateStory(projectId: string, story: Story): Promise<void> {
    const { id, ...data } = story;
    await updateDoc(doc(db, "projects", projectId, "stories", id), data);
  }

  async deleteStory(projectId: string, storyId: string): Promise<void> {
    const storyTasks = await this.getTasks(projectId, storyId);
    await Promise.all(
      storyTasks.map((t) => this.deleteTask(projectId, storyId, t.id)),
    );
    await deleteDoc(doc(db, "projects", projectId, "stories", storyId));
  }

  async getUser(id: string): Promise<User | null> {
    const snap = await getDoc(doc(db, "users", id));
    return snap.exists() ? mapDoc<User>(snap) : null;
  }

  async getUsers(): Promise<User[]> {
    const snap = await getDocs(users());
    return snap.docs.map(mapDoc<User>);
  }

  async addUser(user: User): Promise<User> {
    if (user.surname === undefined) {
      user.surname = "";
    }
    const ref = doc(db, "users", user.id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await this.notifyNewRegister(user);
    }
    await setDoc(ref, user, { merge: true });

    return user;
  }

  async updateUser(user: User): Promise<User> {
    const { id, ...data } = user;
    await updateDoc(doc(db, "users", id), data);
    return user;
  }

  async getTasks(projectId: string, storyId: string): Promise<Task[]> {
    const snap = await getDocs(tasks(projectId, storyId));
    return snap.docs.map(mapDoc<Task>);
  }

  async getTask(
    projectId: string,
    storyId: string,
    taskId: string,
  ): Promise<Task | null> {
    const snap = await getDoc(
      doc(db, "projects", projectId, "stories", storyId, "tasks", taskId),
    );
    return snap.exists() ? mapDoc<Task>(snap) : null;
  }

  async createTask(model: TaskModel, projectId: string): Promise<Task> {
    const data = {
      ...model,
      state: "todo" as const,
      createdAt: Date.now().toString(),
    };
    const ref = await addDoc(tasks(projectId, model.storyId), data);
    const task: Task = { id: ref.id, ...data };

    await this.syncStoryState(projectId, task.storyId);

    const story = await this.getStory(projectId, task.storyId);
    if (story) {
      await notificationService.send({
        title: "New task created",
        message: `Task "${task.name}" was added to story "${story.title}".`,
        priority: "medium",
        recipientId: story.ownerId,
      });
    }

    return task;
  }

  async updateTask(projectId: string, task: Task): Promise<void> {
    const { id, ...data } = task;
    await updateDoc(
      doc(db, "projects", projectId, "stories", task.storyId, "tasks", id),
      data,
    );
  }

  async deleteTask(
    projectId: string,
    storyId: string,
    taskId: string,
  ): Promise<void> {
    const task = await this.getTask(projectId, storyId, taskId);
    await deleteDoc(
      doc(db, "projects", projectId, "stories", storyId, "tasks", taskId),
    );

    if (task) {
      const story = await this.getStory(projectId, storyId);
      if (story) {
        await notificationService.send({
          title: "Task deleted",
          message: `Task "${task.name}" was removed from story "${story.title}".`,
          priority: "medium",
          recipientId: story.ownerId,
        });
      }
    }
  }

  async assignUser(
    projectId: string,
    storyId: string,
    taskId: string,
    user: User & { role: "devops" | "developer" },
  ): Promise<Task> {
    const task = await this.getTask(projectId, storyId, taskId);
    if (!task) throw new Error("Task not found");

    const updated: Task = {
      ...task,
      state: "doing",
      startedAt: new Date().toString(),
      assignedUser: user,
    };

    const { id, ...data } = updated;
    await updateDoc(
      doc(db, "projects", projectId, "stories", storyId, "tasks", taskId),
      data,
    );
    await this.syncStoryState(projectId, storyId);

    const story = await this.getStory(projectId, storyId);
    if (story) {
      await notificationService.send({
        title: "User assigned to task",
        message: `${user.name} ${user.surname} was assigned to "${task.name}" in story "${story.title}".`,
        priority: "high",
        recipientId: story.ownerId,
      });
    }

    return updated;
  }

  async completeTask(
    projectId: string,
    storyId: string,
    taskId: string,
  ): Promise<Task> {
    const task = await this.getTask(projectId, storyId, taskId);
    if (!task) throw new Error("Task not found");
    if (task.state !== "doing") throw new Error("Task is not in progress");

    const updated: Task = {
      ...task,
      state: "done",
      finishedAt: new Date().toString(),
    };

    const { id, ...data } = updated;
    await updateDoc(
      doc(db, "projects", projectId, "stories", storyId, "tasks", taskId),
      data,
    );
    await this.syncStoryState(projectId, storyId);

    const story = await this.getStory(projectId, storyId);
    if (story) {
      await notificationService.send({
        title: "Task completed",
        message: `Task "${task.name}" in story "${story.title}" has been marked as done.`,
        priority: "medium",
        recipientId: story.ownerId,
      });
    }

    return updated;
  }

  private async syncStoryState(
    projectId: string,
    storyId: string,
  ): Promise<void> {
    const [story, storyTasks] = await Promise.all([
      this.getStory(projectId, storyId),
      this.getTasks(projectId, storyId),
    ]);
    if (!story) return;

    const allDone =
      storyTasks.length > 0 && storyTasks.every((t) => t.state === "done");
    const anyDoing = storyTasks.some(
      (t) => t.state === "doing" || t.state === "done",
    );
    const nextState = allDone ? "done" : anyDoing ? "doing" : "todo";

    if (story.state !== nextState) {
      await updateDoc(doc(db, "projects", projectId, "stories", storyId), {
        state: nextState,
      });
      await notificationService.send({
        title: "Story status changed",
        message: `Story "${story.title}" status changed to "${nextState}".`,
        priority: nextState === "done" ? "medium" : "low",
        recipientId: story.ownerId,
      });
    }
  }

  private async notifyNewRegister(user: User): Promise<void> {
    const admins = (await this.getUsers()).filter((u) => u.role === "admin");
    await Promise.all(
      admins.map((u) =>
        notificationService.send({
          title: "New user created",
          message: `User "${user.name}" has been created.`,
          priority: "high",
          recipientId: u.id,
        }),
      ),
    );
  }
}
