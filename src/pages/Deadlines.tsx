import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Deadlines: FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<
    { listName: string; taskName: string; startDate: string; dueDate: string }[]
  >([]);

  const token = localStorage.getItem("token");

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
          `${
            import.meta.env.VITE_API_BASE_URL || ""
          }/getTasks?listID=${list.listID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (Array.isArray(tasksResponse.data)) {
         // console.log("Mapping taskresponse");
          tasksResponse.data.forEach((task: any) => {
            const currentTime=new Date().toISOString();
            //console.log("Adding task");
            //console.log(currentTime+" "+task.time);
            if(currentTime<task.time){
              //console.log("Passed the if statement");
              //console.log(list.listName);
              //console.log(task.description);
              //console.log(task.time);
            allTasks.push({
              listName: list.listName,
              taskName: task.description,
              startDate: currentTime, // Set startDate to the current time in ISO 8601 format
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

      const chart = new (window as any).google.visualization.Timeline(container);
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
    <div>
      <h2>Task Deadlines Timeline</h2>
      <div id="timeline" style={{ width: "90%", height: "500px", margin: "auto" }}></div>
      <button onClick={() => navigate("/home")}>Back to Home</button>
    </div>
  );
};

export default Deadlines;
