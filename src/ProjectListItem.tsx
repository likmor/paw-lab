import { useEffect, useState } from "react";
import type { Project } from "./types";
import { useNavigate } from "react-router-dom";

type ProjectListItemProps = {
  item: Project;
  onDelete: (id: number) => void;
  onUpdate: (item: Project) => void;
};
function ProjectListItem({ item, onDelete, onUpdate }: ProjectListItemProps) {
const nav = useNavigate();

  const [isUpdate, setIsUpdate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setTitle(item.title);
    setDescription(item.description);
  }, []);

  function Update() {
    if (isUpdate) {
      onUpdate({ id: item.id, title, description });
    }
    setIsUpdate(!isUpdate);
  }

  function HandleClick() {
    nav(`/project/${item.id}`)
  }
  return (
    <div className="card card-border bg-base-200 w-96 cursor-pointer hover:bg-base-300" onClick={HandleClick}>
      <div className="card-body">
        {isUpdate ? (
          <input
            type="text"
            className="input"
            placeholder="Title"
            onChange={(e) => setTitle(e.currentTarget.value)}
            value={title}
          ></input>
        ) : (
          <h2 className="card-title">{item.title}</h2>
        )}
        {isUpdate ? (
          <input
            type="text"
            className="input"
            placeholder="Description"
            onChange={(e) => setDescription(e.currentTarget.value)}
            value={description}
          ></input>
        ) : (
          <p>{item.description}</p>
        )}
        <div className="card-actions justify-end">
          <button className="btn btn-info" onClick={() => Update()}>
            {isUpdate ? "Save" : "Update"}
          </button>
          <button className="btn btn-error" onClick={() => onDelete(item.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProjectListItem;
