import { notificationService } from "../services/notificationService";
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

  getProjects(): Project[] {
    return this.load<Project>(PROJECTS_KEY);
  }

  getProject(id: number): Project | null {
    return this.getProjects().find((p) => p.id === id) ?? null;
  }

  createProject(model: ProjectModel): Project {
    const projects = this.getProjects();
    let max = projects.reduce((prev, cur) => Math.max(prev, cur.id), 0) + 1;
    console.log(max);
    const project: Project = { id: max, ...model };

    projects.push(project);
    this.save(PROJECTS_KEY, projects);

    this.getUsers()
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

  updateProject(project: Project) {
    const projects = this.getProjects().map((p) =>
      p.id === project.id ? project : p,
    );

    this.save(PROJECTS_KEY, projects);
  }

  deleteProject(id: number) {
    const stories = this.load<Story>(STORIES_KEY).filter(
      (s) => s.projectId !== id,
    );
    const storyIds = new Set(stories.map((s) => s.id));
    const tasks = this.load<Task>(TASKS_KEY).filter((t) =>
      storyIds.has(t.storyId),
    );

    this.save(
      PROJECTS_KEY,
      this.getProjects().filter((p) => p.id !== id),
    );
    this.save(STORIES_KEY, stories);
    this.save(TASKS_KEY, tasks);
  }

  setActiveProject(id: number) {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id.toString());
  }

  deleteActiveProject() {
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
  }

  getActiveProject(): number | null {
    const id = localStorage.getItem(ACTIVE_PROJECT_KEY);
    return id ? Number(id) : null;
  }

  getStories(projectId: number): Story[] {
    const stories = this.load<Story>(STORIES_KEY);
    return stories.filter((s) => s.projectId === projectId);
  }
  getStory(storyId: number): Story {
    const stories = this.load<Story>(STORIES_KEY);
    return stories.filter((s) => s.id === storyId)[0];
  }

  createStory(model: StoryModel, projectId: number): Story {
    const stories = this.load<Story>(STORIES_KEY);

    const story: Story = {
      ...model,
      id: Date.now(),
      createdAt: new Date(),
      ownerId: 0,
      projectId,
    };

    stories.push(story);
    this.save(STORIES_KEY, stories);

    return story;
  }

  updateStory(story: Story) {
    const stories = this.load<Story>(STORIES_KEY).map((s) =>
      s.id === story.id ? story : s,
    );

    this.save(STORIES_KEY, stories);
  }

  deleteStory(id: number) {
    const stories = this.load<Story>(STORIES_KEY).filter((s) => s.id !== id);
    const tasks = this.load<Task>(TASKS_KEY).filter((t) => t.storyId !== id);
    this.save(STORIES_KEY, stories);
    this.save(TASKS_KEY, tasks);
  }

  getUser(): User {
    return { id: 0, name: "Adam", surname: "Kowalski", role: "admin" };
  }
  getUsers(): User[] {
    return [
      this.getUser(),
      { id: 1, name: "Karol", surname: "Nowak", role: "developer" },
      { id: 2, name: "Wojciech", surname: "Lewandowski", role: "devops" },
    ];
  }

  getTasks(storyId: number): Task[] {
    return this.load<Task>(TASKS_KEY).filter((t) => t.storyId === storyId);
  }

  createTask(model: TaskModel): Task {
    const tasks = this.load<Task>(TASKS_KEY);
    const task: Task = {
      ...model,
      id: Date.now(),
      createdAt: new Date(),
      state: "todo",
    };
    tasks.push(task);
    this.save(TASKS_KEY, tasks);
    this.syncStoryState(task.storyId);

    const story = this.getStory(task.storyId);
    if (story) {
      notificationService.send({
        title: "New task created",
        message: `Task "${task.name}" was added to story "${story.title}"`,
        priority: "medium",
        recipientId: story.ownerId,
      });
    }

    return task;
  }

  updateTask(task: Task): void {
    const tasks = this.load<Task>(TASKS_KEY).map((t) =>
      t.id === task.id ? task : t,
    );
    this.save(TASKS_KEY, tasks);
  }

  deleteTask(id: number): void {
    const task = this.load<Task>(TASKS_KEY).find((t) => t.id === id);
    this.save(
      TASKS_KEY,
      this.load<Task>(TASKS_KEY).filter((t) => t.id !== id),
    );

    if (task) {
      const story = this.getStory(task.storyId);
      if (story) {
        notificationService.send({
          title: "Task deleted",
          message: `Task "${task.name}" was removed from story "${story.title}".`,
          priority: "medium",
          recipientId: story.ownerId,
        });
      }
    }
  }

  assignUser(
    taskId: number,
    user: User & { role: "devops" | "developer" },
  ): Task {
    const tasks = this.load<Task>(TASKS_KEY);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) throw new Error("Task not found");

    const updated: Task = {
      ...task,
      state: "doing",
      startedAt: new Date(),
      assignedUser: user,
    };

    this.save(
      TASKS_KEY,
      tasks.map((t) => (t.id === taskId ? updated : t)),
    );
    this.syncStoryState(task.storyId);

    const story = this.getStory(task.storyId);
    if (story) {
      notificationService.send({
        title: "User assigned to task",
        message: `${user.name} ${user.surname} was assigned to task "${task.name}" in story "${story.title}".`,
        priority: "high",
        recipientId: story.ownerId,
      });
    }

    return updated;
  }

  completeTask(taskId: number): Task {
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
      finishedAt: new Date(),
    };

    this.save(
      TASKS_KEY,
      tasks.map((t) => (t.id === taskId ? updated : t)),
    );
    this.syncStoryState(task.storyId);

    const story = this.getStory(task.storyId);
    if (story) {
      notificationService.send({
        title: "Task completed",
        message: `Task "${task.name}" in story "${story.title}" has been marked as done.`,
        priority: "medium",
        recipientId: story.ownerId,
      });
    }

    return updated;
  }

  private syncStoryState(storyId: number): void {
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
}
