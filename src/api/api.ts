import type { Project, ProjectModel, Story, StoryModel, User } from "../types";
import { LocalStorageApi } from "./localStorageApi";

export type AppApi = {
  getProjects(): Project[];
  getProject(id: number): Project | null;
  createProject(model: ProjectModel): Project;
  updateProject(project: Project): void;
  deleteProject(id: number): void;

  setActiveProject(id: number): void;
  getActiveProject(): number | null;
  deleteActiveProject() : void;

  getStories(projectId: number): Story[];
  createStory(model: StoryModel, projectId: number): Story;
  updateStory(story: Story): void;
  deleteStory(id: number): void;

  getUser(): User;
};

export const api: AppApi = new LocalStorageApi();
