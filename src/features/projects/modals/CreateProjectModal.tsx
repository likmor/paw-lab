import type { ProjectModel } from "../../../types";

type CreateProjectModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  add: (item: ProjectModel) => void;
}

function CreateProjectModal({ visible, setVisible, add }: CreateProjectModalProps) {
  function OnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const newProject: ProjectModel = {
      title,
      description,
    };
    
    add(newProject);
    setVisible(false)
  }


  const handleClose = () => {
    setVisible(false)
  }


  return (
    <dialog className="modal" open={visible}>
      <form method="dialog" className="modal-box" onSubmit={OnSubmit}>
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" type="button" onClick={handleClose}>✕</button>
        <div className="flex justify-center">

          <fieldset className="fieldset rounded-box w-xs  p-4">
            <legend className="fieldset-legend">New Porject</legend>

            <label className="label">Title</label>
            <input
              type="text"
              className="input"
              placeholder="Name"
              name="title"
            />

            <label className="label">Description</label>
            <input
              type="text"
              className="input"
              placeholder="Description"
              name="description"
            />
            <button className="btn  btn-primary">Add</button>
          </fieldset>
        </div>
      </form>
    </dialog>
  );
}
export default CreateProjectModal;