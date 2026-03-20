import type {
  Project,
  ProjectModel,
  Story,
  StoryModel,
  Task,
  TaskModel,
  User,
} from "../types";
import { LocalStorageApi } from "./localStorageApi";

export type AppApi = {
  getProjects(): Project[];
  getProject(id: number): Project | null;
  createProject(model: ProjectModel): Project;
  updateProject(project: Project): void;
  deleteProject(id: number): void;

  setActiveProject(id: number): void;
  getActiveProject(): number | null;
  deleteActiveProject(): void;

  getStories(projectId: number): Story[];
  getStory(storyId: number): Story;
  createStory(model: StoryModel, projectId: number): Story;
  updateStory(story: Story): void;
  deleteStory(id: number): void;

  getTasks(storyId: number): Task[];
  createTask(model: TaskModel): Task;
  updateTask(task: Task): void;
  deleteTask(id: number): void;

  assignUser(taskId: number, user: User): Task;
  completeTask(taskId: number): Task;

  getUser(): User;
  getUsers(): User[];
};

export const api: AppApi = new LocalStorageApi();
