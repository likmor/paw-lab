import { useEffect, useState } from "react";
import type { Project, ProjectModel } from "../../../types";
import CreateProjectModal from "../modals/CreateProjectModal";
import { api } from "../../../config";
import ProjectListItem from "./ProjectListItem";

function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  async function LoadProjects() {
    setProjects(await api.getProjects() ?? []);
  }
  useEffect(() => {
    LoadProjects();
  }, []);

  async function addProject(model: ProjectModel) {
    await api.createProject(model);
    LoadProjects();
  }

  async function deleteProject(id: string) {
    await api.deleteProject(id);
    LoadProjects();
  }

  async function updateProject(project: Project) {
    console.log(project);
    await api.updateProject(project);
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
          <ProjectListItem
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
