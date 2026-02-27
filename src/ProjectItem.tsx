import type { Project } from './types';



function ProjectItem({ item }: { item: Project }) {

    return
    <>
        {item.id}
    </>
}
export default ProjectItem