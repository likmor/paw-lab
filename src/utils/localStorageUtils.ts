import type { Project } from "../types";

const KEY = "projects";

export const saveProjects = (projects: Project[]): void => {
  localStorage.setItem(KEY, JSON.stringify(projects));
};

export const loadProjects = (): Project[] => {
  const projects = localStorage.getItem(KEY);

  if (!projects) return [];

  try {
    return JSON.parse(projects) as Project[];
  } catch {
    return [];
  }
};