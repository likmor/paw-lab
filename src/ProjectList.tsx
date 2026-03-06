import { useEffect, useState } from "react";
import ProjectItem from "./ProjectListItem";
import type { Project, ProjectModel } from "./types";
import CreateProjectModal from "./CreateProjectModal";
import { api } from "./api/api";
import { useNavigate } from "react-router-dom";

function ProjectList() {
  const nav = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  function LoadProjects() {
    setProjects(api.getProjects());
  }
  useEffect(() => {
    LoadProjects();
  }, []);

  function addProject(model: ProjectModel) {
    api.createProject(model);
    LoadProjects();
  }

  function deleteProject(id: number) {
    api.deleteProject(id);
    LoadProjects();
  }

  function updateProject(project: Project) {
    api.updateProject(project);
    LoadProjects();
  }

  return (
    <div>
      <h2>Project list</h2>

      <button
        className="btn"
        onClick={() => setIsCreateModalOpen((prev) => !prev)}
      >
        Add project
      </button>

      <CreateProjectModal
        visible={isCreateModalOpen}
        setVisible={setIsCreateModalOpen}
        add={addProject}
      />

      <div className="grid justify-center gap-2">
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            item={project}
            onDelete={deleteProject}
            onUpdate={updateProject}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectList;
