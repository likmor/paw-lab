import type { Project } from "./types";
type CreateProjectProps = {
  add: (item: Project) => void;
};
function CreateProject({ add }: CreateProjectProps) {
  function OnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const newProject: Project = {
      id: 1,
      title,
      description,
    };

    add(newProject);
  }

  return (
    <div className="flex justify-center">
      <form onSubmit={OnSubmit}>
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
      </form>
    </div>
  );
}
export default CreateProject;
