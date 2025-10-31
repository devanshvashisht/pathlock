import React from "react";

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onComplete: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onComplete }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      {tasks.length === 0 && (
        <p style={{ color: "#aaa" }}>No tasks yet. Add one above 👆</p>
      )}

      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff1",
            padding: "10px 14px",
            borderRadius: "6px",
            marginBottom: "10px",
            border: "1px solid #444",
          }}
        >
          <span
            style={{
              textDecoration: task.isCompleted ? "line-through" : "none",
              color: task.isCompleted ? "#999" : "#fff",
            }}
          >
            {task.title}
          </span>

          {!task.isCompleted && (
            <button
              onClick={() => onComplete(task.id)}
              style={{
                background: "#6d28d9",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                color: "white",
              }}
            >
              Complete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
