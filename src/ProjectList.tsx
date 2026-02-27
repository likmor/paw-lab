import { useEffect, useState } from "react";
import ProjectItem from "./ProjectItem";
import type { Project } from "./types";
import { loadProjects, saveProjects } from "./utils/localStorageUtils";
import CreateProject from "./CreateProject";

function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [add, setAdd] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
  }, [localStorage]);

  function addProject(item: Project) {
    let max = 0;
    if (projects.length > 0) {
      max = Math.max(...projects.map((el) => el.id));
      max += 1;
    }
    item.id = max;
    setProjects([...projects, item]);
    saveProjects([...projects, item]);
  }
  function deleteProject(id: number) {
    const filtered = projects.filter((el) => el.id !== id);
    setProjects(filtered);
    saveProjects(filtered);
  }
  function updateProject(item: Project) {
    const updatedProjects = projects.map((p) => (p.id === item.id ? item : p));
    setProjects([...updatedProjects]);
    saveProjects(updatedProjects);
  }
  return (
    <div className="">
      <h2>Project list</h2>
      <button className="btn btn-primary" onClick={() => setAdd(!add)}>
        Add
      </button>

      {add && <CreateProject add={addProject} />}

      <div className="grid justify-center gap-2">
        {projects.map((el) => (
          <ProjectItem
            key={el.id}
            item={el}
            onDelete={deleteProject}
            onUpdate={updateProject}
          ></ProjectItem>
        ))}
      </div>
    </div>
  );
}
export default ProjectList;
