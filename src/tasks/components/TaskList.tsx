import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import type { Task, TaskModel } from "../../types";
import CreateTaskModal from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";
import TaskItem from "./TaskItem.tsx";

type Params = {
  projectId: string;
  storyId: string;
};

function TaskList() {
  const { projectId, storyId } = useParams<Params>();

  const project = api.getProject(Number(projectId));
  const story = api.getStory(Number(storyId));

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>();

  function loadTasks() {
    setTasks(api.getTasks(Number(storyId)));
  }

  useEffect(() => {
    loadTasks();
  }, [storyId]);

  function addTask(model: TaskModel) {
    api.createTask(model);
    loadTasks();
  }

  function deleteTask(id: number) {
    api.deleteTask(id);
    loadTasks();
  }

  function updateTask(task: Task) {
    api.updateTask(task);
    loadTasks();
  }

  const todoTasks = tasks.filter((t) => t.state === "todo");
  const doingTasks = tasks.filter((t) => t.state === "doing");
  const doneTasks = tasks.filter((t) => t.state === "done");
  console.log(story);
  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Project title: {project?.title}</h1>
        <p className="text-base-content/60">Project description: {project?.description}</p>
        <div className="divider" />
        <h2 className="text-lg font-medium">Story title:{story?.title}</h2>
        <p className="text-base-content/60">Story description: {story?.description}</p>
      </div>

      <button className="btn mb-4" onClick={() => setIsCreateOpen(true)}>
        Add task
      </button>

      {isCreateOpen && (
        <CreateTaskModal
          key="create"
          visible={isCreateOpen}
          storyId={Number(storyId)}
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
        />
      )}
      <h1 className="text-4xl">Task list</h1>

      <div className="flex flex-row gap-6 justify-center bg-base-200">
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
