import { useNavigate } from "react-router-dom";

function CreateProject() {

    let navigate = useNavigate()
    
    function OnSubmit(e: any) {
        e.preventDefault()
        const title = e.target["title"].value;
        const description = e.target["description"].value;
        let projects = JSON.parse(localStorage.getItem("projects") ?? "[]")
        let p = {title, description}
        projects.push(p);
        localStorage.setItem("projects", JSON.stringify(p))
        navigate("/")
    }

    return (
        <>
            <h2>Create new project</h2>
            <form onSubmit={OnSubmit}>

                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend">New Porject</legend>

                    <label className="label">Title</label>
                    <input type="text" className="input" placeholder="Name" name="title"/>

                    <label className="label">Description</label>
                    <input type="text" className="input" placeholder="Description" name="description"/>
                    <button className="btn  btn-primary">Add</button>

                </fieldset>
            </form>

        </>

    )
}
export default CreateProject