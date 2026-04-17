export type Project = {
  id: number;
  title: string;
  description: string;
};
export type ProjectModel = Omit<Project, "id">;
export type Role = "admin" | "devops" | "developer" | "guest";
export type User = {
  id: number;
  name: string;
  surname: string;
  role: Role;
  banned: boolean;
};
export const roles: Role[] = ["admin" , "devops" , "developer" , "guest"];

export type Priority = "low" | "middle" | "high";
export const priorities: Priority[] = ["low", "middle", "high"];

export type State = "todo" | "doing" | "done";
export const states: State[] = ["todo", "doing", "done"];

export type Story = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  projectId: number;
  createdAt: Date;
  state: State;
  ownerId: number;
};
export type StoryModel = Omit<Story, "id" | "projectId" | "ownerId">;

export type TaskBase = {
  id: number;
  name: string;
  description: string;
  priority: Priority;
  storyId: number;
  estimatedTime: number;
  createdAt: Date;
};

export type TaskTodo = TaskBase & {
  state: "todo";
};

export type TaskDoing = TaskBase & {
  state: "doing";
  startedAt: Date;
  assignedUser: User & { role: "devops" | "developer" };
};

export type TaskDone = TaskBase & {
  state: "done";
  startedAt: Date;
  finishedAt: Date;
  assignedUser: User & { role: "devops" | "developer" };
};

export type Task = TaskTodo | TaskDoing | TaskDone;

export type TaskModel = Omit<Task, "id" | "projectId">;

export type NotificationPriority = "low" | "medium" | "high";

export type Notification = {
  id: number;
  title: string;
  message: string;
  date: string;
  priority: NotificationPriority;
  isRead: boolean;
  recipientId: number;
};

export type NotificationModel = Omit<Notification, "id" | "date" | "isRead">;

export type Payload = {
  sub: number;
  name: string;
  family_name: string;
  given_name: string;
  email: string;
  picture: string;
  exp: number;
};
