import axios from "axios";

const API = axios.create({
  //baseURL: "http://localhost:3005/api"
  baseURL: "https:carlos-trigo.onrender.com/api"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

interface Task{
    id: number
    name: string
    completed: boolean
    editing?: boolean // solo para control local
}

export const getTasks = () => API.get("/tasks");
export const createTask = (text: string) => API.post("/tasks", { name: text }, {  
  headers: {
    "Content-Type": "application/json"
  }
});
export const deleteTaskApi = (id: number) => API.delete(`/tasks/${id}`);
export const toggleTaskApi = (id: number, done:boolean) => API.patch(`/tasks/${id}`,{ done: done }, {  
  headers: {
    "Content-Type": "application/json"
  }
});
export const editTaskApi = (id: number, name: string) =>
  API.put(`/tasks/${id}`, { name }, {  
  headers: {
    "Content-Type": "application/json"
  }
});

export default API;
