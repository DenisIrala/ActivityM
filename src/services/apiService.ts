import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const apiRequest = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: object
) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}/${endpoint}`,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error;
  }
};

export const fetchTasks = async (listID: number) => {
  return apiRequest("GET", `getTasks?listID=${listID}`);
};

export const addTask = async (
  listID: number,
  taskDescription: string,
  taskTime: string
) => {
  return apiRequest("POST", "addTask", { listID, taskDescription, taskTime });
};

export const updateTask = async (
  itemID: number,
  newDescription: string,
  newTime: string
) => {
  return apiRequest("PUT", "updateTask", { itemID, newDescription, newTime });
};

export const markTask = async (itemID: number, taskMark: boolean) => {
  return apiRequest("POST", "markTask", { itemID, taskMark });
};

export const deleteTask = async (itemID: number) => {
  return apiRequest("DELETE", `deleteTask/${itemID}`);
};
