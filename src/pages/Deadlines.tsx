import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../authUtils";
import Sidebar from "../components/Sidebar";
import "../css/Deadlines.css";
import axios from "axios";

const Deadlines: FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<
    { listName: string; taskName: string; startDate: string; dueDate: string }[]
  >([]);
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const handleLogoutWrapper = () => handleLogout(navigate);

  const fetchTasks = async () => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_API_BASE_URL || ""
      }/getLists?token=${token}`;

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(response.data)) {
        console.error("Error: API did not return an array!", response.data);
        return;
      }

      const allTasks: any[] = [];

      for (const list of response.data) {
        const tasksResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || ""}/getTasks?listID=${
            list.listID
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (Array.isArray(tasksResponse.data)) {
          tasksResponse.data.forEach((task: any) => {
            const currentTime = new Date().toISOString();
            if (currentTime < task.time) {
              allTasks.push({
                listName: list.listName,
                taskName: task.description,
                startDate: currentTime,
                dueDate: task.time,
              });
            }
          });
        }
      }

      setTasks(allTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const loadGoogleCharts = () => {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.onload = () => {
        (window as any).google.charts.load("current", {
          packages: ["timeline"],
        });
        (window as any).google.charts.setOnLoadCallback(drawChart);
      };
      document.body.appendChild(script);
    };

    const drawChart = () => {
      if (!(window as any).google?.visualization) return;

      const container = document.getElementById("timeline");
      if (!container) return;

      const chart = new (window as any).google.visualization.Timeline(
        container
      );
      const dataTable = new (window as any).google.visualization.DataTable();

      dataTable.addColumn({ type: "string", id: "List" });
      dataTable.addColumn({ type: "string", id: "Task" });
      dataTable.addColumn({ type: "date", id: "Start" });
      dataTable.addColumn({ type: "date", id: "End" });

      dataTable.addRows(
        tasks.map((task) => [
          task.listName,
          task.taskName,
          new Date(task.startDate),
          new Date(task.dueDate),
        ])
      );

      const options = {
        timeline: { showRowLabels: true },
        height: 400,
      };

      chart.draw(dataTable, options);
    };

    if (tasks.length > 0) {
      loadGoogleCharts();
    }
  }, [tasks]);

  return (
    <div className="deadlines-page-container">
      <Sidebar username={username} onLogout={handleLogoutWrapper} />

      <div className="deadlines-main-container">
        <button className="back-btn d-back" onClick={() => navigate("/home")}>
          {" "}
          ⬅ back
        </button>
        <h2 className="page-title deadline-title">📆 Deadlines Timeline</h2>
        <p className="description">
          View upcoming task deadlines across all your lists in a clear visual
          timeline.
        </p>
        <div id="timeline" className="timeline-chart"></div>
      </div>
    </div>
  );
};

export default Deadlines;
