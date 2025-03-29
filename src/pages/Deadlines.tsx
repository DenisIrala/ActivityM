import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiRequest } from "../services/apiService";

const Deadlines: FC = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState<{ listID: number; listName: string }[]>([]);
  const [tasks, setTasks] = useState<
    { listID: number; taskID: number; taskName: string; dueDate: string }[]
  >([]);

  const token = localStorage.getItem("token");

  const fetchLists = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || ""}/getLists`;
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(response.data)) {
        console.error("Error: API did not return an array!", response.data);
        return;
      }

      setLists(response.data);
      fetchTasksForLists(response.data.map((list) => list.listID)); 
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  const fetchTasksForLists = async (listIDs: number[]) => {
    try {
      let allTasks = [];
      for (const listID of listIDs) {
        const response = await apiRequest("GET", `getTasks/${listID}?token=${token}`);
        if (Array.isArray(response)) {
          allTasks.push(...response.map((task) => ({ ...task, listID })));
        }
      }
      setTasks(allTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div>
      <h1>Deadline Timeline</h1>
      <ul>
        {tasks.length === 0 ? (
          <p>No upcoming deadlines.</p>
        ) : (
          tasks
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) 
            .map((task) => (
              <li key={task.taskID}>
                <strong>{task.taskName}</strong> (Due: {task.dueDate}) - From List:{" "}
                {lists.find((list) => list.listID === task.listID)?.listName || "Unknown"}
              </li>
            ))
        )}
      </ul>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default Deadlines;
