import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import { Link } from "react-router-dom";

type Project = {
  id: number;
  name: string;
};


export default function ProjectList() {
  const { token, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    api.getProjects(token).then((data: Project[]) => setProjects(data));
  }, []);

  const createProject = async () => {
    if (!newProject.trim()) return;
    const project = await api.addProject(token, newProject);
    setProjects([...projects, project]);
    setNewProject("");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Projects</h1>
        <button onClick={logout} className="text-red-500">Logout</button>
      </div>

      <div className="flex gap-2 mb-4">
        <input className="border p-2 flex-1" placeholder="New Project Name"
          value={newProject} onChange={(e) => setNewProject(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2" onClick={createProject}>Add</button>
      </div>

      <ul className="space-y-2">
        {projects.map((p: any) => (
          <li key={p.id} className="border p-3 rounded bg-white">
            <Link to={`/projects/${p.id}`} className="text-blue-600 underline">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
