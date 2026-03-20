import { useState, type BaseSyntheticEvent } from "react";
import { priorities, type Priority, type TaskModel } from "../../types";

type Props = {
  visible: boolean;
  storyId: number;
  setVisible: (visible: boolean) => void;
  onCreate: (item: TaskModel) => void;
};

function CreateTaskModal({ visible, storyId, setVisible, onCreate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("middle");
  const [estimatedTime, setEstimatedTime] = useState(0);

  function onSubmit(e: BaseSyntheticEvent) {
    e.preventDefault();
    onCreate({ name, description, priority, estimatedTime, storyId, state: "todo", createdAt: new Date() });
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
            <legend className="fieldset-legend">New task</legend>

            <label className="label">Name</label>
            <input type="text" className="input" placeholder="Task name" value={name} onChange={(e) => setName(e.currentTarget.value)} />

            <label className="label">Description</label>
            <input type="text" className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.currentTarget.value)} />

            <label className="label">Priority</label>
            <select className="select" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>

            <label className="label">Estimated time (h)</label>
            <input type="number" className="input" min={0} value={estimatedTime} onChange={(e) => setEstimatedTime(Number(e.currentTarget.value))} />

            <button className="btn btn-primary mt-2">Add</button>
          </fieldset>
        </div>
      </form>
    </dialog>
  );
}

export default CreateTaskModal;