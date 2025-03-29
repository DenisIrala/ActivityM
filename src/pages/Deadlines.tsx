import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // Uncomment if using API
// import { apiRequest } from "../services/apiService"; // Uncomment if using API

const Deadlines: FC = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState<{ listID: number; listName: string }[]>([]);
  const [tasks, setTasks] = useState<
    { listID: number; taskID: number; taskName: string; dueDate: string }[]
  >([]);

  const token = "mockToken"; // Pretend there's a valid token

  // Mock list response (instead of API)
  const mockLists = [
    { listID: 1, listName: "Work Tasks" },
    { listID: 2, listName: "Personal Goals" },
  ];

  // Mock task response (instead of API)
  const mockTasks = [
    { taskID: 101, listID: 1, taskName: "Submit Report", dueDate: "2025-04-01" },
    { taskID: 102, listID: 2, taskName: "Buy Groceries", dueDate: "2025-03-30" },
    { taskID: 103, listID: 1, taskName: "Finish Presentation", dueDate: "2025-03-29" },
  ];

  // Simulate API call by setting state with mock data
  const fetchLists = async () => {
    setLists(mockLists);
    fetchTasksForLists(mockLists.map((list) => list.listID)); // Use mock list IDs

    /* Uncomment this to use API instead of mock data
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || ""}/getLists?token=${token}`;
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
    */
  };

  const fetchTasksForLists = async (listIDs: number[]) => {
    // Filter mockTasks to only include those belonging to provided listIDs
    const filteredTasks = mockTasks.filter((task) => listIDs.includes(task.listID));
    setTasks(filteredTasks);

    /* Uncomment this to use API instead of mock data
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
    */
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div>
      <h1>Deadline Timeline (Test Mode)</h1>
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

