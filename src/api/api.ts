import type {
  Project,
  ProjectModel,
  Story,
  StoryModel,
  Task,
  TaskModel,
  User,
} from "../types";

export type AppApi = {
  getProjects(): Promise<Project[] | null>;
  getProject(id: string): Promise<Project | null>;
  createProject(model: ProjectModel): Promise<Project>;
  updateProject(project: Project): Promise<void>;
  deleteProject(id: string): Promise<void>;

  setActiveProject(id: string, userId: string): void;
  getActiveProject(userId: string): Promise<string | null>;
  deleteActiveProject(userId: string): void;

  getStories(projectId: string): Promise<Story[]>;
  getStory(projectId: string, storyId: string): Promise<Story | null>;
  createStory(model: StoryModel,  projectId: string, ownerID: string): Promise<Story>;
  updateStory(projectId: string, story: Story): Promise<void>;
  deleteStory(projectId: string, storyId: string): Promise<void>;

  getTasks(projectId: string, storyId: string): Promise<Task[]>;
  createTask(model: TaskModel, projectId: string): Promise<Task>;
  updateTask(projectId: string, task: Task): Promise<void>;
  deleteTask(projectId: string, storyId: string, taskId: string): Promise<void>;

  assignUser(projectId: string, storyId: string, taskId: string, user: User): Promise<Task>;
  completeTask(projectId: string, storyId: string, taskId: string): Promise<Task>;

  getUser(id: string): Promise<User | null>;
  getUsers(): Promise<User[]>;
  addUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
};

