import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5277/api/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    const res = await axios.post("http://localhost:5277/api/tasks", { description: newTask });
    setTasks([...tasks, res.data]);
    setNewTask("");
  };

  const toggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const res = await axios.put(`http://localhost:5277/api/tasks/${id}`, {
      ...task,
      completed: !task.completed,
    });
    setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
  };

  const deleteTask = async (id: number) => {
    await axios.delete(`http://localhost:5277/api/tasks/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="main">
      <header>
        <h1>🗒️ My Task Manager</h1>
      </header>

      <div className="task-container">
        <div className="input-box">
          <input
            type="text"
            placeholder="Enter task description..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={addTask}>Add</button>
        </div>

        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={task.completed ? "completed" : ""}>
                <span onClick={() => toggleTask(task.id)}>{task.description}</span>
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer>© 2025 Task Manager</footer>
    </div>
  );
}

export default App;
