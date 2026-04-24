export type Project = {
  id: string;
  title: string;
  description: string;
};
export type ProjectModel = Omit<Project, "id">;
export type Role = "admin" | "devops" | "developer" | "guest";
export type User = {
  id: string;
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
  id: string;
  title: string;
  description: string;
  priority: Priority;
  projectId: string;
  createdAt: string;
  state: State;
  ownerId: string;
};
export type StoryModel = Omit<Story, "id" | "projectId" | "ownerId" | "createdAt">;

export type TaskBase = {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  storyId: string;
  estimatedTime: number;
  createdAt: string;
};

export type TaskTodo = TaskBase & {
  state: "todo";
};

export type TaskDoing = TaskBase & {
  state: "doing";
  startedAt: string;
  assignedUser: User & { role: "devops" | "developer" };
};

export type TaskDone = TaskBase & {
  state: "done";
  startedAt: string;
  finishedAt: string;
  assignedUser: User & { role: "devops" | "developer" };
};

export type Task = TaskTodo | TaskDoing | TaskDone;

export type TaskModel = Omit<Task, "id" | "projectId" | "createdAt">;

export type NotificationPriority = "low" | "medium" | "high";

export type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: NotificationPriority;
  isRead: boolean;
  recipientId: string;
};

export type NotificationModel = Omit<Notification, "id" | "date" | "isRead">;

export type Payload = {
  sub: string;
  name: string;
  family_name: string;
  given_name: string;
  email: string;
  picture: string;
  exp: number;
};
