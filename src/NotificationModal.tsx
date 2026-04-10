import { useState, type BaseSyntheticEvent } from "react";
import { priorities, type Priority, type StoryModel } from "./types";
import type { Notification } from "./types";

type Props = {
  visible: boolean;
  item: Notification;
  setVisible: (visible: boolean) => void;
};

function NotificationModal({ visible, setVisible, item }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("middle");

  return (
    <dialog className="modal" open={visible}>
      <div className="flex justify-center">
        <div className="card w-96 bg-base-100 card-lg shadow-sm">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            type="button"
            onClick={() => setVisible(false)}
          >
            ✕
          </button>
          <div className="card-body">
            <h2 className="card-title">{item.title}</h2>
            <p>{item.message}</p>
            <div className="justify-end card-actions"></div>
            <span className="text-xs text-base-content/40">
              {new Date(item.date).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default NotificationModal;
