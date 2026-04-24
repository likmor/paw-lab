import { useEffect, useState, type BaseSyntheticEvent } from "react";
import {
  priorities,
  type Priority,
  type Task,
  type User,
} from "../../../types";
import { api } from "../../../config";

type Props = {
  visible: boolean;
  item: Task;
  setVisible: (visible: boolean) => void;
  onUpdate: (item: Task) => void;
  projectId: string;
  storyId: string;
};

function EditTaskModal({
  visible,
  item,
  setVisible,
  onUpdate,
  projectId,
  storyId,
}: Props) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [priority, setPriority] = useState<Priority>(item.priority);
  const [estimatedTime, setEstimatedTime] = useState(item.estimatedTime);
  const [assignableUsers, setAssignableUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchAssignableUsers = async () => {
      const users = await api.getUsers();
      setAssignableUsers(
        users.filter((u) => u.role === "admin" || u.role === "developer"),
      );
    };
    fetchAssignableUsers();
  }, []);

  async function onSubmit(e: BaseSyntheticEvent) {
    e.preventDefault();
    onUpdate({ ...item, name, description, priority, estimatedTime });
    setVisible(false);
  }

  async function handleAssign(user: User) {
    const updated = await api.assignUser(projectId, storyId, item.id, user);
    onUpdate(updated);
    setVisible(false);
  }

  async function handleComplete() {
    const updated = await api.completeTask(projectId, storyId, item.id);
    onUpdate(updated);
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
            <legend className="fieldset-legend">Edit task</legend>

            <label className="label">Name</label>
            <input
              type="text"
              className="input"
              placeholder="Task name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
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

            <label className="label">Estimated time (h)</label>
            <input
              type="number"
              className="input"
              min={0}
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(Number(e.currentTarget.value))}
            />

            <button className="btn btn-primary mt-2">Save</button>

            {item.state !== "done" && (
              <>
                <select
                  className="select"
                  value={item.state === "doing" ? item.assignedUser.id : ""}
                  onChange={(e) => {
                    const user = assignableUsers.find(
                      (u) => u.id === e.target.value,
                    );
                    if (user) handleAssign(user);
                  }}
                >
                  <option value="" disabled>
                    Select user
                  </option>
                  {assignableUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} {u.surname} ({u.role})
                    </option>
                  ))}
                </select>
              </>
            )}

            {item.state === "doing" && (
              <button
                type="button"
                className="btn btn-success"
                onClick={handleComplete}
              >
                Mark as done
              </button>
            )}

            {item.state === "done" && (
              <>
                <div className="divider">Completed</div>
                <p className="text-sm">
                  {`Finished at: ${"finishedAt" in item && new Date(item.finishedAt).toLocaleString()}`}
                </p>
              </>
            )}
          </fieldset>
        </div>
      </form>
    </dialog>
  );
}

export default EditTaskModal;
