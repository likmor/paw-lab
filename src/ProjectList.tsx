import { useEffect, useState } from 'react';
import ProjectItem from './ProjectItem';
import type { Project } from './types';
import { useNavigate } from 'react-router-dom';


function ProjectList() {
    let navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([])

    useEffect(() => {
        setProjects(JSON.parse(localStorage.getItem("projects") ?? "[]") ?? [])
    }, [])


    return (
        <>
            <h2>Project list</h2>
            <button className='btn' onClick={() => navigate("projects/new")}>Add new project</button>
            {projects.map(el => <ProjectItem item={el}></ProjectItem>)}
        </>

    )
}
export default ProjectList