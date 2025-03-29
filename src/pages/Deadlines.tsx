import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/apiService";
import axios from "axios";

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
        const response = await apiRequest("GET", `getTasks/${listID}`);
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

  const generateTimelineScript = () => {
    const taskData = tasks
      .map((task) => {
        const listName = lists.find((list) => list.listID === task.listID)?.listName || "Unknown";
        const dueDate = new Date(task.dueDate);
        const startDate = new Date(dueDate);
        startDate.setDate(dueDate.getDate() - 2); 

        return `['${listName}', '${task.taskName}', new Date(${startDate.getFullYear()}, ${
          startDate.getMonth()
        }, ${startDate.getDate()}), new Date(${dueDate.getFullYear()}, ${dueDate.getMonth()}, ${dueDate.getDate()})]`;
      })
      .join(",\n");

    return `
      google.charts.load("current", {packages:["timeline"]});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
          var container = document.getElementById('timeline');
          var chart = new google.visualization.Timeline(container);
          var dataTable = new google.visualization.DataTable();

          dataTable.addColumn({ type: 'string', id: 'List' });
          dataTable.addColumn({ type: 'string', id: 'Task' });
          dataTable.addColumn({ type: 'date', id: 'Start' });
          dataTable.addColumn({ type: 'date', id: 'End' });

          dataTable.addRows([
              ${taskData}
          ]);

          var options = {
              timeline: { showRowLabels: true },
              height: 400
          };

          chart.draw(dataTable, options);
      }
    `;
  };

  return (
    <div>
      <h1>Deadline Timeline</h1>

      {/* Inject generated script into an iframe or external page */}
      <iframe
        srcDoc={`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Task Deadlines</title>
              <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
              <script type="text/javascript">
                  ${generateTimelineScript()}
              </script>
              <style>
                  body { font-family: Arial, sans-serif; text-align: center; }
                  #timeline { width: 90%; height: 500px; margin: auto; }
              </style>
          </head>
          <body>
              <h2>Task Deadlines Timeline</h2>
              <div id="timeline"></div>
          </body>
          </html>
        `}
        style={{ width: "100%", height: "600px", border: "none" }}
      ></iframe>

      <button onClick={() => navigate("/home")}>Back to Home</button>
    </div>
  );
};

export default Deadlines;
