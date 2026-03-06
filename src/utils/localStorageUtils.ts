import type { Project, Story, StoryModel } from "../types";

const PROJECTS_KEY = "projects";
const STORIES_KEY = "stories";

export const saveProjects = (projects: Project[]): void => {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

export const loadProjects = (): Project[] => {
  const projects = localStorage.getItem(PROJECTS_KEY);

  if (!projects) return [];

  try {
    return JSON.parse(projects) as Project[];
  } catch {
    return [];
  }
};
export const loadProject = (id: number): Project | null => {
  const projects = localStorage.getItem(PROJECTS_KEY);

  if (!projects) return null;

  try {
    const ps = JSON.parse(projects) as Project[];
    const proj = ps.find(el => el.id === id)
    if (proj) {
      return proj
    }
  } catch {
    return null;
  }
  return null;
};

export const loadStories = (id: number): Story[] => {
  const storiesRaw = localStorage.getItem(STORIES_KEY)
  if (!storiesRaw) {
    return [];
  }
  try {
    const stories = JSON.parse(storiesRaw) as Story[];
    stories.filter(el => el.projectId === id)
    return stories
  } catch {
    return [];
  }
}

export const createStories = (model: StoryModel) => {
  const storiesRaw = localStorage.getItem(STORIES_KEY)

  try {
    const stories = JSON.parse(storiesRaw) as Story[];
    stories.filter(el => el.projectId === id)
    return stories
  } catch {
  }
  let max = 0;
  if (projects.length > 0) {
    max = Math.max(...projects.map((el) => el.id));
    max += 1;
  }
}