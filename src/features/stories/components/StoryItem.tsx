import type { BaseSyntheticEvent } from "react";
import type { Story } from "../../../types";
import { useNavigate, useParams } from "react-router-dom";

type StoryItemProps = {
  item: Story;
  onDelete: (id: string) => void;
  onUpdate: (item: Story) => void;
  onEdit: (item: Story) => void;
};

function StoryItem({ item, onDelete, onUpdate, onEdit }: StoryItemProps) {
  const nav = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  function handleClick() {
    nav(`/project/${projectId}/story/${item.id}`);
  }

  function handleDelete(e: BaseSyntheticEvent) {
    e.stopPropagation();
    onDelete(item.id);
  }

  return (
    <div
      className="card card-border bg-base-200 w-96 cursor-pointer hover:bg-base-300  shadow-xl"
      onClick={handleClick}
    >
      <div className="card-body">
        <h2 className="card-title">{item.title}</h2>
        <p>{item.description}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-info"
            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
          >
            Edit
          </button>
          <button className="btn btn-error" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoryItem;