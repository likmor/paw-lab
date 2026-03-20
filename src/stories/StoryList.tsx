import { useParams } from "react-router-dom";
import type { Story, StoryModel } from "../types";
import { useEffect, useState } from "react";
import CreateStoryModal from "./CreateStoryModal";
import EditStoryModal from "./EditStoryModal";
import { api } from "../api/api";
import StoryItem from "./StoryItem";

type Params = { projectId: string };

function StoryList() {
  const { projectId } = useParams<Params>();
  const project = api.getProject(Number(projectId));

  const [stories, setStories] = useState<Story[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editStory, setEditStory] = useState<Story | undefined>();

  function loadStories() {
    setStories(api.getStories(project?.id ?? -1));
  }

  useEffect(() => {
    loadStories();
  }, [projectId]);

  function addStory(model: StoryModel) {
    api.createStory(model, project?.id ?? -1);
    loadStories();
  }

  function deleteStory(id: number) {
    api.deleteStory(id);
    loadStories();
  }

  function updateStory(story: Story) {
    api.updateStory(story);
    loadStories();
  }

  const todoStories  = stories.filter((s) => s.state === "todo");
  const doingStories = stories.filter((s) => s.state === "doing");
  const doneStories  = stories.filter((s) => s.state === "done");

  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">{project?.title}</h1>
        <p className="text-base-content/60">{project?.description}</p>
      </div>

      <button className="btn mb-4" onClick={() => setIsCreateOpen(true)}>
        Add story
      </button>

      {isCreateOpen && (
        <CreateStoryModal
          key="create"
          visible={isCreateOpen}
          setVisible={setIsCreateOpen}
          onCreate={addStory}
        />
      )}

      {editStory && (
        <EditStoryModal
          key={editStory.id}
          visible={!!editStory}
          item={editStory}
          setVisible={(v) => !v && setEditStory(undefined)}
          onUpdate={updateStory}
        />
      )}

      <h2 className="text-2xl mb-4">Stories</h2>
      <div className="flex flex-row gap-6 justify-center">
        <div className="flex flex-col gap-2 min-w-96">
          <h3>Todo</h3>
          {todoStories.map((s) => (
            <StoryItem key={s.id} item={s} onDelete={deleteStory} onUpdate={updateStory} onEdit={setEditStory} />
          ))}
        </div>
        <div className="flex flex-col gap-2 min-w-96">
          <h3>Doing</h3>
          {doingStories.map((s) => (
            <StoryItem key={s.id} item={s} onDelete={deleteStory} onUpdate={updateStory} onEdit={setEditStory} />
          ))}
        </div>
        <div className="flex flex-col gap-2 min-w-96">
          <h3>Done</h3>
          {doneStories.map((s) => (
            <StoryItem key={s.id} item={s} onDelete={deleteStory} onUpdate={updateStory} onEdit={setEditStory} />
          ))}
        </div>
      </div>
    </>
  );
}

export default StoryList;