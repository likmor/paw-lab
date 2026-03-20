import type { Project, ProjectModel, Story, StoryModel, User } from "../types";
import type { AppApi } from "./api";

const PROJECTS_KEY = "projects";
const STORIES_KEY = "stories";
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

    return project;
  }

  updateProject(project: Project) {
    const projects = this.getProjects().map((p) =>
      p.id === project.id ? project : p,
    );

    this.save(PROJECTS_KEY, projects);
  }

  deleteProject(id: number) {
    const projects = this.getProjects().filter((p) => p.id !== id);
    const stories = this.load<Story>(STORIES_KEY)
    const fStories = stories.filter(s => s.projectId !== id)
    this.save(PROJECTS_KEY, projects);
    this.save(STORIES_KEY, fStories);
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

  createStory(model: StoryModel, projectId: number): Story {
    const stories = this.load<Story>(STORIES_KEY);

    const story: Story = {
      ...model,
      id: Date.now(),
      createdAt: new Date(),
      ownerId: 1,
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
    this.save(STORIES_KEY, stories);
  }

  getUser(): User {
    return { id: 0, name: "Adam", surname: "Kowalski" };
  }
}
