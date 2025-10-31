const API_BASE = "http://localhost:5231";

export const api = {
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  getProjects: async (token: string) => {
    const res = await fetch(`${API_BASE}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  addProject: async (token: string, name: string) => {
    const res = await fetch(`${API_BASE}/api/projects`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ name })
    });
    return res.json();
  },

  getProjectDetails: async (token: string, id: number) => {
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  addTask: async (token: string, projectId: number, title: string) => {
    const res = await fetch(`${API_BASE}/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ title })
    });
    return res.json();
  },

  updateTask: async (token: string, taskId: number, isComplete: boolean) => {
    const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ isComplete })
    });
    return res.json();
  }
};
