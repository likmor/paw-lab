import { useEffect, useState } from "react";
import ProjectItem from "./ProjectListItem";
import type { Project, ProjectModel } from "../types";
import CreateProjectModal from "./CreateProjectModal";
import { api } from "../api/api";

function ProjectList() {
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
      <CreateProjectModal
        visible={isCreateModalOpen}
        setVisible={setIsCreateModalOpen}
        add={addProject}
      />
      <button
        className="btn"
        onClick={() => setIsCreateModalOpen((prev) => !prev)}
      >
        Add project
      </button>

      <h2 className="text-2xl mb-4">Projects</h2>
      <div className="flex flex-row flex-wrap gap-6 justify-center bg-base-200 shadow-xl p-4 rounded-lg">
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
