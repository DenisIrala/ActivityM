import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { clearAuth } from "../authUtils";
import { fetchAllLists } from "../services/apiService";
import "../css/task.css";

import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
  markTask,
} from "../services/apiService";

const TaskPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  var username = localStorage.getItem("username");
  const [tasks, setTasks] = useState<
    { itemID: number; description: string; time: string; mark: boolean }[]
  >([]);
  const [newTask, setNewTask] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskDescription, setEditedTaskDescription] = useState("");
  const [listName, setListName] = useState("");

  useEffect(() => {
    if (id) {
      loadTasks();
      loadListName();
    }
  }, [id]);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks(Number(id));
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const loadListName = async () => {
    try {
      const allLists = await fetchAllLists();
      const currentList = allLists.find(
        (list: any) => list.listID === Number(id)
      );
      if (currentList) setListName(currentList.listName);
    } catch (error) {
      console.error("Error fetching list name:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !taskTime.trim()) return;

    try {
      await addTask(Number(id), newTask, taskTime);
      setNewTask("");
      setTaskTime("");
      loadTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTask = (taskId: number, currentDescription: string) => {
    setEditingTaskId(taskId);
    setEditedTaskDescription(currentDescription);
  };

  const handleSaveEdit = async (taskId: number) => {
    if (!editedTaskDescription.trim()) return;

    try {
      await updateTask(
        taskId,
        editedTaskDescription,
        taskTime || new Date().toISOString().split("T")[0]
      );
      setEditingTaskId(null);
      setEditedTaskDescription("");
      loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleMarkTask = async (taskId: number, isCompleted: boolean) => {
    try {
      await markTask(taskId, !isCompleted);
      loadTasks();
    } catch (error) {
      console.error("Error marking task:", error);
    }
  };

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(isoString));
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/", { replace: true });
  };

  return (
    <div className="task-page-container">
      <Sidebar username={username} onLogout={handleLogout} />

      <div className="task-main-container">
        <button className="back-btn" onClick={() => navigate("/home")}>
          {" "}
          ⬅ back
        </button>
        <h1 className="list-title">{listName || "Task List"}</h1>
        <h3>Tasks:</h3>
        <ul>
          {tasks.map((task) => (
            <li key={task.itemID} className="task-item">
              <input
                type="checkbox"
                checked={task.mark}
                onChange={() => handleMarkTask(task.itemID, task.mark)}
              />
              {editingTaskId === task.itemID ? (
                <div className="task-details">
                  <input
                    type="text"
                    value={editedTaskDescription}
                    onChange={(e) => setEditedTaskDescription(e.target.value)}
                  />
                  <input
                    type="date"
                    className="date"
                    value={taskTime || task.time}
                    onChange={(e) => setTaskTime(e.target.value)}
                  />
                  <div className="task-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleSaveEdit(task.itemID)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="task-details">
                  <p
                    style={{
                      textDecoration: task.mark ? "line-through" : "none",
                      fontWeight: "500",
                    }}
                  >
                    {task.description}
                  </p>
                  <p
                    style={{
                      textDecoration: task.mark ? "line-through" : "none",
                      color: "#404040",
                      fontSize: "16px",
                    }}
                  >
                    {formatDate(task.time)}
                  </p>
                  <div className="task-actions">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEditTask(task.itemID, task.description)
                      }
                    >
                      edit
                    </button>
                    {/* <span>|</span> */}
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTask(task.itemID)}
                    >
                      delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="add-task-section">
          <h3>Add a Task:</h3>
          <div className="add-task-inputs">
            <input
              type="text"
              placeholder="Task description"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <input
              type="date"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
            />
            <button className="add-task-btn" onClick={handleAddTask}>
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
