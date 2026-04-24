import { useState, type BaseSyntheticEvent } from "react";
import { priorities, type Priority, type StoryModel } from "../../../types";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onCreate: (item: StoryModel) => void;
};

function CreateStoryModal({ visible, setVisible, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("middle");

  function onSubmit(e: BaseSyntheticEvent) {
    e.preventDefault();
    onCreate({ title, description, priority, state: "todo" });
    setVisible(false);
  }

  return (
    <dialog className="modal" open={visible}>
      <form method="dialog" className="modal-box" onSubmit={onSubmit}>
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          onClick={() => setVisible(false)}
        >
          ✕
        </button>
        <div className="flex justify-center">
          <fieldset className="fieldset rounded-box w-xs p-4">
            <legend className="fieldset-legend">New story</legend>

            <label className="label">Title</label>
            <input
              type="text"
              className="input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />

            <label className="label">Description</label>
            <input
              type="text"
              className="input"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />

            <label className="label">Priority</label>
            <select
              className="select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <button className="btn btn-primary mt-2">Add</button>
          </fieldset>
        </div>
      </form>
    </dialog>
  );
}

export default CreateStoryModal;
