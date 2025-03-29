import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Deadlines: FC = () => {
  const [lists, setLists] = useState<{ listID: number; listName: string }[]>([]);
  const [tasks, setTasks] = useState<
    { listID: number; taskID: number; taskName: string; dueDate: string }[]
  >([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLists();
    fetchTasks();
    loadGoogleCharts();
  }, []);

  const fetchLists = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || ""}/getLists?token=${token}`;
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Lists:", response.data);

      if (!Array.isArray(response.data)) {
        console.error("Error: API did not return an array!", response.data);
        return;
      }

      setLists(response.data);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || ""}/getTasks?token=${token}`;
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Tasks:", response.data);

      if (!Array.isArray(response.data)) {
        console.error("Error: API did not return an array!", response.data);
        return;
      }

      setTasks(response.data);
      drawChart(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const loadGoogleCharts = () => {
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.async = true;
    script.onload = () => {
      window.google.charts.load("current", { packages: ["timeline"] });
      window.google.charts.setOnLoadCallback(() => drawChart(tasks));
    };
    document.body.appendChild(script);
  };

  const drawChart = (taskData: any[]) => {
    if (!window.google || !window.google.visualization) {
      console.warn("Google Charts not yet loaded");
      return;
    }

    const container = document.getElementById("timeline");
    if (!container) return;

    const chart = new window.google.visualization.Timeline(container);
    const dataTable = new window.google.visualization.DataTable();

    dataTable.addColumn({ type: "string", id: "List" });
    dataTable.addColumn({ type: "string", id: "Task" });
    dataTable.addColumn({ type: "date", id: "Start" });
    dataTable.addColumn({ type: "date", id: "End" });

    dataTable.addRows(
      taskData.map((task) => [
        `List ${task.listID}`,
        task.taskName,
        new Date(task.dueDate),
        new Date(task.dueDate),
      ])
    );

    const options = {
      timeline: { showRowLabels: true },
      height: 400,
    };

    chart.draw(dataTable, options);
  };

  return (
    <div>
      <h1>Task Deadlines</h1>

      <button onClick={() => navigate("/")}>Back to Home</button>

      <h3>Your Lists:</h3>
      <ul>
        {lists.map((list) => (
          <li key={list.listID}>{list.listName}</li>
        ))}
      </ul>

      <h3>Tasks:</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.taskID}>
            {task.taskName} - Due: {task.dueDate}
          </li>
        ))}
      </ul>

      <div id="timeline" style={{ width: "90%", height: "500px", margin: "auto" }}></div>
    </div>
  );
};

export default Deadlines;

