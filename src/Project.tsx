import { useParams } from "react-router-dom";
import type { Project, Story, StoryModel } from "./types";
import { useEffect, useState } from "react";
import CreateStoryModal from "./CreateStoryModal";
import { api } from "./api/api";
import StoryItem from "./StoryItem";
type Params = {
  id: string;
};
function Project() {
  const { id } = useParams<Params>();

  const project = api.getProject(Number(id));

  const [stories, setStories] = useState<Story[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function LoadStories() {
    setStories(api.getStories(project?.id ?? -1));
  }
  useEffect(() => {
    LoadStories();
  }, [id]);

  function addStory(model: StoryModel) {
    api.createStory(model, project?.id ?? -1);
    LoadStories();
  }

  function deleteStory(id: number) {
    api.deleteStory(id);
    LoadStories();
  }

  function updateStory(story: Story) {
    api.updateStory(story);
    LoadStories();
  }
  const todoStories = stories.filter((el) => el.state === "todo");
  const doingStories = stories.filter((el) => el.state === "doing");
  const doneStories = stories.filter((el) => el.state === "done");

  return (
    <>
      <h1>Project name: {project?.title}</h1>
      <h1>Project description: {project?.description}</h1>
      <button className="btn" onClick={() => setIsModalOpen(!isModalOpen)}>
        Add story
      </button>
      <CreateStoryModal
        visible={isModalOpen}
        setVisible={setIsModalOpen}
        Create={addStory}
        Update={() => {}}
      />

      <div className="flex flex-row gap-6 justify-center">
        <div className="flex flex-col gap-2 min-w-96">
          <h2>Todo</h2>
          {todoStories.map((el) => (
            <StoryItem
              item={el}
              onDelete={deleteStory}
              onUpdate={updateStory}
              key={el.id}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 min-w-96">
          <h2>Doing</h2>

          {doingStories.map((el) => (
            <StoryItem
              item={el}
              onDelete={deleteStory}
              onUpdate={updateStory}
              key={el.id}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 min-w-96">
          <h2>Done</h2>

          {doneStories.map((el) => (
            <StoryItem
              item={el}
              onDelete={deleteStory}
              onUpdate={updateStory}
              key={el.id}
            />
          ))}
        </div>
      </div>
    </>
  );
}
export default Project;
