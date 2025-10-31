import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

export default function ProjectDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [taskTitle, setTaskTitle] = useState("");

  useEffect(() => {
    api.getProjectDetails(token, Number(id)).then(setProject);
  }, []);

  const addTask = async () => {
    const t = await api.addTask(token, Number(id), taskTitle);
    setProject({ ...project, tasks: [...project.tasks, t] });
    setTaskTitle("");
  };

  const toggleTask = async (task: any) => {
    const updated = await api.updateTask(token, task.id, !task.isComplete);

    setProject({
      ...project,
      tasks: project.tasks.map((t: any) =>
        t.id === task.id ? updated : t
      ),
    });
  };

  if (!project) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>

      <div className="flex gap-2 mb-4">
        <input className="border p-2 flex-1" placeholder="Task Title"
          value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
        <button className="bg-blue-600 text-white px-4" onClick={addTask}>Add Task</button>
      </div>

      <ul className="space-y-2">
        {project.tasks.map((task: any) => (
          <li key={task.id} className="border p-2 rounded bg-white flex justify-between">
            <span className={task.isComplete ? "line-through" : ""}>{task.title}</span>
            <button className="text-sm text-purple-600" onClick={() => toggleTask(task)}>
              {task.isComplete ? "Undo" : "Complete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
