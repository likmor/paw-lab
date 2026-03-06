import { useEffect, useState, type BaseSyntheticEvent } from "react";
import {
  priorities,
  states,
  type Priority,
  type Project,
  type State,
  type Story,
  type StoryModel,
} from "./types";

type CreateStoryModalProps = {
  visible: boolean;
  item?: Story;
  setVisible: (visible: boolean) => void;
  Create: (item: StoryModel) => void;
  Update: (item: Story) => void;
};

function CreateStoryModal({
  visible,
  item,
  setVisible,
  Create,
  Update
}: CreateStoryModalProps) {
  const [title, setTitle] = useState(item?.title);
  const [description, setDescription] = useState(item?.description);
  const [priority, setPriority] = useState(item?.priority);
  const [state, setState] = useState(item?.state);
  function OnSubmit(e: BaseSyntheticEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as Priority;
    const state = formData.get("state") as State;
    if (item) {
      const model: Story = {
        ...item,
        title,
        description,
        priority,
        state,
      };

      Update(model);
    } else {
      const model = {
        title,
        description,
        createdAt: new Date(),
        priority,
        state,
      };
      Create(model);
    }

    setVisible(false);
  }

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <dialog id="my_modal_1" className="modal" open={visible}>
      <form method="dialog" className="modal-box" onSubmit={OnSubmit}>
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          onClick={handleClose}
        >
          ✕
        </button>
        <div className="flex justify-center">
          <fieldset className="fieldset rounded-box w-xs  p-4">
            <legend className="fieldset-legend">
              {item ? "Edit Story" : "New Story"}
            </legend>

            <label className="label">Title</label>
            <input
              type="text"
              className="input"
              placeholder="Name"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />

            <label className="label">Description</label>
            <input
              type="text"
              className="input"
              placeholder="Description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
            <label className="label">Priority</label>
            <select
              defaultValue="Pick a color"
              className="select"
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              {priorities.map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
            </select>
            <label className="label">State</label>
            <select
              defaultValue="Pick a color"
              className="select"
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value as State)}
            >
              {states.map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
            </select>
            <button className="btn  btn-primary">
              {item ? "Save" : "Add"}
            </button>
          </fieldset>
        </div>
      </form>
    </dialog>
  );
}
export default CreateStoryModal;
