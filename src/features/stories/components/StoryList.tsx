import { useParams } from "react-router-dom";
import type { Project, Story, StoryModel } from "../../../types";
import { useEffect, useState } from "react";
import CreateStoryModal from "../modals/CreateStoryModal";
import EditStoryModal from "../modals/EditStoryModal";
import { api } from "../../../config";
import StoryItem from "./StoryItem";
import { useAuth } from "../../../context/authContext";

type Params = { projectId: string };

function StoryList() {
  const { projectId } = useParams<Params>();
  const {user} =  useAuth()
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (projectId) api.getProject(projectId).then(setProject);
  }, [projectId]);

  const [stories, setStories] = useState<Story[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editStory, setEditStory] = useState<Story | undefined>();

  async function loadStories() {
    setStories(await api.getStories(projectId ?? ""));
  }

  useEffect(() => {
    loadStories();
  }, [projectId]);

  function addStory(model: StoryModel) {
    api.createStory(model, projectId ?? "", user?.id ?? "");
    loadStories();
  }

  async function deleteStory(id: string) {
    await api.deleteStory(projectId ?? "", id);
    loadStories();
  }

  async function updateStory(story: Story) {
    await api.updateStory(projectId ?? "", story);
    loadStories();
  }

  const todoStories = stories.filter((s) => s.state === "todo");
  const doingStories = stories.filter((s) => s.state === "doing");
  const doneStories = stories.filter((s) => s.state === "done");

  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">
          Project title: {project?.title}
        </h1>
        <p className="text-base-content/60">
          Project description: {project?.description}
        </p>
        <div className="divider" />
      </div>

      <button className="btn mb-4" onClick={() => setIsCreateOpen(true)}>
        Add story
      </button>

      {isCreateOpen && (
        <CreateStoryModal
          visible={isCreateOpen}
          setVisible={setIsCreateOpen}
          onCreate={addStory}
        />
      )}

      {editStory && (
        <EditStoryModal
          visible={!!editStory}
          item={editStory}
          setVisible={(v) => !v && setEditStory(undefined)}
          onUpdate={updateStory}
        />
      )}

      <h2 className="text-2xl mb-4">Stories</h2>
      <div className="flex flex-row gap-6 justify-center bg-base-200 shadow-xl p-4 rounded-lg">
        <div className="flex flex-col gap-2 min-w-96">
          <h3>Todo</h3>
          {todoStories.map((s) => (
            <StoryItem
              key={s.id}
              item={s}
              onDelete={deleteStory}
              onUpdate={updateStory}
              onEdit={setEditStory}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 min-w-96">
          <h3>Doing</h3>
          {doingStories.map((s) => (
            <StoryItem
              key={s.id}
              item={s}
              onDelete={deleteStory}
              onUpdate={updateStory}
              onEdit={setEditStory}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 min-w-96">
          <h3>Done</h3>
          {doneStories.map((s) => (
            <StoryItem
              key={s.id}
              item={s}
              onDelete={deleteStory}
              onUpdate={updateStory}
              onEdit={setEditStory}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default StoryList;
