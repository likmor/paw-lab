import { useParams } from "react-router-dom";
import type { Project, Story, StoryModel } from "./types";
import { loadProject, loadStories } from "./utils/localStorageUtils";
import { useEffect, useState } from "react";
import CreateStoryModal from "./CreateStoryModal";
type ProjectProps = {
}
type Params = {
    id: string;
}
function Project() {
    const { id } = useParams<Params>();
    const project = loadProject(Number(id))
    const [stories, setStories] = useState<Story[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const s = loadStories(Number(id))
        setStories(s)
    }, [])
    function addStory(story : StoryModel) {
        
    }

    return (
        <>
            <h1>Project name: {project?.title}</h1>
            <h1>Project description: {project?.description}</h1>
            <button className="btn" onClick={() => setIsModalOpen(!isModalOpen)}>Add story</button>
            <CreateStoryModal visible={isModalOpen} setVisible={setIsModalOpen} add={addProject} />

            <div className="flex flex-col">
                <div>{stories.map(el => el.state === "todo")}</div>
                <div>{stories.map(el => el.state === "doing")}</div>
                <div>{stories.map(el => el.state === "done")}</div>
            </div>
        </>
    )

}
export default Project;