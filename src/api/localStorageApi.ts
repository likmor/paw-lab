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

const PROJECTS_KEY = "projects";
const STORIES_KEY = "stories";
const TASKS_KEY = "tasks";
const ACTIVE_PROJECT_KEY = "activeProject";
const USERS_KEY = "users";

export class LocalStorageApi implements AppApi {
  private load<T>(key: string): T[] {
    const raw = localStorage.getItem(key);
    if (!raw) return [];

    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private save<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getProjects(): Promise<Project[]> {
    return Promise.resolve(this.load<Project>(PROJECTS_KEY));
  }

  getProject(id: string): Promise<Project | null> {
    return this.getProjects().then(
      (projects) => projects.find((p) => p.id === id) ?? null,
    );
  }

  async createProject(model: ProjectModel): Promise<Project> {
    const projects = await this.getProjects();
    const project: Project = { id: Date.now().toString(), ...model };
    projects.push(project);
    this.save(PROJECTS_KEY, projects);
    (await this.getUsers())
      .filter((u) => u.role === "admin")
      .forEach((u) =>
        notificationService.send({
          title: "New project created",
          message: `Project "${project.title}" has been created.`,
          priority: "high",
          recipientId: u.id,
        }),
      );
    return project;
  }

  async updateProject(project: Project): Promise<void> {
    const projects = await this.getProjects();
    const updatedProjects = projects.map((p) =>
      p.id === project.id ? project : p,
    );

    this.save(PROJECTS_KEY, updatedProjects);
    return Promise.resolve();
  }

  async deleteProject(id: string): Promise<void> {
    const stories = this.load<Story>(STORIES_KEY).filter(
      (s) => s.projectId !== id,
    );
    const storyIds = new Set(stories.map((s) => s.id));
    const tasks = this.load<Task>(TASKS_KEY).filter((t) =>
      storyIds.has(t.storyId),
    );

    this.save(
      PROJECTS_KEY,
      (await this.getProjects()).filter((p) => p.id !== id),
    );
    this.save(STORIES_KEY, stories);
    this.save(TASKS_KEY, tasks);
    return Promise.resolve();
  }

  setActiveProject(id: string) {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  }

  deleteActiveProject() {
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
  }

  getActiveProject(): Promise<string | null> {
    const id = localStorage.getItem(ACTIVE_PROJECT_KEY);
    return id ? Promise.resolve(id) : Promise.resolve(null);
  }

  getStories(projectId: string): Promise<Story[]> {
    const stories = this.load<Story>(STORIES_KEY);
    return Promise.resolve(stories.filter((s) => s.projectId === projectId));
  }
  getStory(projectId: string, storyId: string): Promise<Story | null> {
    const stories = this.load<Story>(STORIES_KEY);
    return Promise.resolve(stories.filter((s) => s.id === storyId)[0] ?? null);
  }

  createStory(
    model: StoryModel,
    projectId: string,
    ownerID: string,
  ): Promise<Story> {
    const stories = this.load<Story>(STORIES_KEY);

    const story: Story = {
      ...model,
      id: Date.now().toString(),
      createdAt: Date.now().toString(),
      ownerId: ownerID,
      projectId,
    };

    stories.push(story);
    this.save(STORIES_KEY, stories);

    return Promise.resolve(story);
  }

  updateStory(projectId: string, story: Story): Promise<void> {
    const stories = this.load<Story>(STORIES_KEY).map((s) =>
      s.id === story.id ? story : s,
    );

    this.save(STORIES_KEY, stories);
    return Promise.resolve();
  }

  deleteStory(projectId: string, id: string): Promise<void> {
    const stories = this.load<Story>(STORIES_KEY).filter((s) => s.id !== id);
    const tasks = this.load<Task>(TASKS_KEY).filter((t) => t.storyId !== id);
    this.save(STORIES_KEY, stories);
    this.save(TASKS_KEY, tasks);
    return Promise.resolve();
  }

  getUser(id: string): Promise<User | null> {
    return Promise.resolve(
      this.load<User>(USERS_KEY).find((u) => u.id === id) ?? null,
    );
  }

  getUsers(): Promise<User[]> {
    return Promise.resolve(this.load<User>(USERS_KEY));
    // return [
    //   this.getUser(),
    //   { id: 1, name: "Karol", surname: "Nowak", role: "developer", banned: false },
    //   { id: 2, name: "Wojciech", surname: "Lewandowski", role: "devops", banned: true },
    // ];
  }

  getTasks(projectId: string, storyId: string): Promise<Task[]> {
    return Promise.resolve(
      this.load<Task>(TASKS_KEY).filter((t) => t.storyId === storyId),
    );
  }

  async createTask(model: TaskModel, projectId: string): Promise<Task> {
    const tasks = this.load<Task>(TASKS_KEY);
    const task: Task = {
      ...model,
      id: Date.now().toString(),
      createdAt: Date.now().toString(),
      state: "todo",
    };
    tasks.push(task);
    this.save(TASKS_KEY, tasks);
    this.syncStoryState(task.storyId);

    const story = await this.getStory(projectId, task.storyId);
    if (story) {
      notificationService.send({
        title: "New task created",
        message: `Task "${task.name}" was added to story "${story.title}"`,
        priority: "medium",
        recipientId: story.ownerId,
      });
    }

    return Promise.resolve(task);
  }

  updateTask(projectId: string, task: Task): Promise<void> {
    const tasks = this.load<Task>(TASKS_KEY).map((t) =>
      t.id === task.id ? task : t,
    );
    this.save(TASKS_KEY, tasks);
    return Promise.resolve();
  }

  async deleteTask(projectId: string, storyId: string, taskId: string): Promise<void> {
    const task = this.load<Task>(TASKS_KEY).find((t) => t.id === taskId);
    this.save(
      TASKS_KEY,
      this.load<Task>(TASKS_KEY).filter((t) => t.id !== taskId),
    );

    if (task) {
      const story = await this.getStory(projectId, task.storyId);
      if (story) {
        notificationService.send({
          title: "Task deleted",
          message: `Task "${task.name}" was removed from story "${story.title}".`,
          priority: "medium",
          recipientId: story.ownerId,
        });
      }
    }
    return Promise.resolve();
  }

  async assignUser(
    projectId: string,
    storyId: string,
    taskId: string,
    user: User & { role: "devops" | "developer" },
  ): Promise<Task> {
    const tasks = this.load<Task>(TASKS_KEY);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) throw new Error("Task not found");

    const updated: Task = {
      ...task,
      state: "doing",
      startedAt: Date.now().toString(),
      assignedUser: user,
    };

    this.save(
      TASKS_KEY,
      tasks.map((t) => (t.id === taskId ? updated : t)),
    );
    this.syncStoryState(task.storyId);

    const story = await this.getStory(projectId,task.storyId);
    if (story) {
      notificationService.send({
        title: "User assigned to task",
        message: `${user.name} ${user.surname} was assigned to task "${task.name}" in story "${story.title}".`,
        priority: "high",
        recipientId: story.ownerId,
      });
    }

    return Promise.resolve(updated);
  }

  async completeTask(projectId: string, storyId: string, taskId: string): Promise<Task> {
    const tasks = this.load<Task>(TASKS_KEY);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      throw new Error("Task not found");
    }
    if (task.state !== "doing") {
      throw new Error("Task not found");
    }

    const updated: Task = {
      ...task,
      state: "done",
      finishedAt: new Date().toString(),
    };

    this.save(
      TASKS_KEY,
      tasks.map((t) => (t.id === taskId ? updated : t)),
    );
    this.syncStoryState(task.storyId);

    const story = await this.getStory(projectId, task.storyId);
    if (story) {
      notificationService.send({
        title: "Task completed",
        message: `Task "${task.name}" in story "${story.title}" has been marked as done.`,
        priority: "medium",
        recipientId: story.ownerId,
      });
    }

    return Promise.resolve(updated);
  }

  private syncStoryState(storyId: string): void {
    const stories = this.load<Story>(STORIES_KEY);
    const story = stories.find((s) => s.id === storyId);
    if (!story) return;

    const storyTasks = this.load<Task>(TASKS_KEY).filter(
      (t) => t.storyId === storyId,
    );

    const allDone =
      storyTasks.length > 0 && storyTasks.every((t) => t.state === "done");
    const anyDoing = storyTasks.some(
      (t) => t.state === "doing" || t.state === "done",
    );

    const nextState = allDone ? "done" : anyDoing ? "doing" : "todo";

    if (story.state !== nextState) {
      this.save(
        STORIES_KEY,
        stories.map((s) => (s.id === storyId ? { ...s, state: nextState } : s)),
      );

      notificationService.send({
        title: "Story status changed",
        message: `Story "${story.title}" status changed to "${nextState}".`,
        priority: nextState === "done" ? "medium" : "low",
        recipientId: story.ownerId,
      });
    }
  }
  public addUser(user: User) {
    const users = this.load<User>(USERS_KEY);
    users.push(user);
    this.notifyNewRegister(user);
    this.save(USERS_KEY, users);
    return Promise.resolve(user);
  }

  public updateUser(user: User) {
    const users = this.load<User>(USERS_KEY).map((u) =>
      u.id == user.id ? user : u,
    );
    this.save(USERS_KEY, users);
    return Promise.resolve(user);
  }
  private async notifyNewRegister(user: User) {
    (await this.getUsers())
      .filter((u) => u.role === "admin")
      .forEach((u) =>
        notificationService.send({
          title: "New user created",
          message: `User "${user.name}" has been created.`,
          priority: "high",
          recipientId: u.id,
        }),
      );
  }
}
