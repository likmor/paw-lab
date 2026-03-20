import type { Task } from "../../types";

type TaskItemProps = {
  item: Task;
  onDelete: (id: number) => void;
  onEdit: (item: Task) => void;
};

function TaskItem({ item, onDelete, onEdit }: TaskItemProps) {
  return (
    <div className="card card-border bg-base-200 w-96 cursor-pointer hover:bg-base-300">
      <div className="card-body">
        <h2 className="card-title">{item.name}</h2>
        <p>{item.description}</p>
        <div className="flex gap-2 text-sm text-base-content/60">
          <span>Priority: {item.priority}</span>
          <br/>
          <span>Est: {item.estimatedTime}h</span>
        </div>
        <div className="card-actions justify-end">
          <button className="btn btn-info" onClick={() => onEdit(item)}>
            Edit
          </button>
          <button
            className="btn btn-error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
