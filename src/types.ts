export type Project = {
  id: number;
  title: string;
  description: string;
};
export type ProjectModel = Omit<Project, "id">;
export type User = {
  id: number;
  name: string;
  surname: string;
};
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
