import { useEffect, useState, type BaseSyntheticEvent } from "react";
import type { Project, Story, StoryModel } from "./types";
import { useNavigate } from "react-router-dom";
import CreateStoryModal from "./CreateStoryModal";

type StoryItemProps = {
  item: Story;
  onDelete: (id: number) => void;
  onUpdate: (item: Story) => void;
};
function StoryItem({ item, onDelete, onUpdate }: StoryItemProps) {
  const nav = useNavigate();

  const [isUpdate, setIsUpdate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTitle(item.title);
    setDescription(item.description);
  }, [item]);

  function HandleClick() {

  }

  function HandleUpdate(model: Story) {
    onUpdate(model);
  }

  function HandleDelete(e: BaseSyntheticEvent) {
    e.stopPropagation();
    onDelete(item.id);
  }
  return (
    <div
      className="card card-border bg-base-200 w-96 cursor-pointer hover:bg-base-300"
      onClick={HandleClick}
    >
        <CreateStoryModal
          Update={HandleUpdate}
          Create={() => {}}
          visible={isModalOpen}
          setVisible={setIsModalOpen}
          item={item}
        />
      
      <div className="card-body">
        <h2 className="card-title">{item.title}</h2>
        <p>{item.description}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-info" onClick={() => setIsModalOpen(true)}>
            Edit
          </button>
          <button className="btn btn-error" onClick={(e) => HandleDelete(e)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
export default StoryItem;
