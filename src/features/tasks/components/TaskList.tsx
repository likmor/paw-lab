import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../../config";
import type { Project, Story, Task, TaskModel } from "../../../types";
import TaskItem from "./TaskItem.tsx";
import CreateTaskModal from "../modals/CreateTaskModal.tsx";
import EditTaskModal from "../modals/EditTaskModal.tsx";

type Params = {
  projectId: string;
  storyId: string;
};

function TaskList() {
  const { projectId, storyId } = useParams<Params>();
  const [project, setProject] = useState<Project | null>();
  const [story, setStory] = useState<Story | null>();

  useEffect(() => {
    const fetchProjectAndStory = async () => {
      const project = await api.getProject(projectId ?? "");
      const story = await api.getStory(projectId ?? "", storyId ?? "");
      setProject(project ?? null);
      setStory(story ?? null);
    };
    fetchProjectAndStory();
  }, [projectId, storyId]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>();

  async function loadTasks() {
    setTasks(await api.getTasks(projectId ?? "", storyId ?? ""));
  }

  useEffect(() => {
    loadTasks();
  }, [storyId]);

  async function addTask(model: TaskModel) {
    await api.createTask(model, projectId ?? "");
    await loadTasks();
  }

  async function deleteTask(id: string) {
    await api.deleteTask(projectId ?? "", storyId ?? "", id);
    await loadTasks();
  }

  async function updateTask(task: Task) {
    await api.updateTask(projectId ?? "", task);
    await loadTasks();
  }

  const todoTasks = tasks.filter((t) => t.state === "todo");
  const doingTasks = tasks.filter((t) => t.state === "doing");
  const doneTasks = tasks.filter((t) => t.state === "done");
  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">
          Project title: {project?.title}
        </h1>
        <p className="text-base-content/60">
          Project description: {project?.description}
        </p>
        <div className="divider" />
        <h2 className="text-lg font-medium">Story title: {story?.title}</h2>
        <p className="text-base-content/60">
          Story description: {story?.description}
        </p>
      </div>

      <button className="btn mb-4" onClick={() => setIsCreateOpen(true)}>
        Add task
      </button>

      {isCreateOpen && (
        <CreateTaskModal
          key="create"
          visible={isCreateOpen}
          storyId={storyId ?? ""}
          setVisible={setIsCreateOpen}
          onCreate={addTask}
        />
      )}

      {editTask && (
        <EditTaskModal
          key={editTask.id}
          visible={!!editTask}
          item={editTask}
          setVisible={(v) => !v && setEditTask(undefined)}
          onUpdate={updateTask}
          projectId={projectId ?? ""}
          storyId={storyId ?? ""}
        />
      )}
      <h2 className="text-2xl mb-4">Tasks</h2>

      <div className="flex flex-row gap-6 justify-center bg-base-200 shadow-xl p-4 rounded-lg">
        <div className="flex flex-col gap-2 min-w-96">
          <h2>Todo</h2>
          {todoTasks.map((t) => (
            <TaskItem
              key={t.id}
              item={t}
              onDelete={deleteTask}
              onEdit={setEditTask}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 min-w-96">
          <h2>Doing</h2>
          {doingTasks.map((t) => (
            <TaskItem
              key={t.id}
              item={t}
              onDelete={deleteTask}
              onEdit={setEditTask}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 min-w-96">
          <h2>Done</h2>
          {doneTasks.map((t) => (
            <TaskItem
              key={t.id}
              item={t}
              onDelete={deleteTask}
              onEdit={setEditTask}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default TaskList;
