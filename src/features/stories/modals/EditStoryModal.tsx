import { useState, type BaseSyntheticEvent } from "react";
import { priorities, type Priority, type Story } from "../../../types";

type Props = {
  visible: boolean;
  item: Story;
  setVisible: (visible: boolean) => void;
  onUpdate: (item: Story) => void;
};

function EditStoryModal({ visible, item, setVisible, onUpdate }: Props) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [priority, setPriority] = useState<Priority>(item.priority);

  function onSubmit(e: BaseSyntheticEvent) {
    e.preventDefault();
    onUpdate({ ...item, title, description, priority });
    setVisible(false);
  }

  return (
    <dialog className="modal" open={visible}>
      <form method="dialog" className="modal-box" onSubmit={onSubmit}>
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          onClick={() => setVisible(false)}
        >✕</button>
        <div className="flex justify-center">
          <fieldset className="fieldset rounded-box w-xs p-4">
            <legend className="fieldset-legend">Edit story</legend>

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
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <button className="btn btn-primary mt-2">Save</button>
          </fieldset>
        </div>
      </form>
    </dialog>
  );
}

export default EditStoryModal;