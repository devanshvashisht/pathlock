import axios from "axios";

export interface TaskItem {
  id: string;
  description: string;
  isCompleted: boolean;
}

const API_URL = "http://localhost:5277/api/tasks";

export const getTasks = async (): Promise<TaskItem[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addTask = async (description: string): Promise<TaskItem> => {
  const res = await axios.post(API_URL, { description });
  return res.data;
};

export const toggleTask = async (id: string): Promise<TaskItem> => {
  const res = await axios.put(`${API_URL}/${id}`);
  return res.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
