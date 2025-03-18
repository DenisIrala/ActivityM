import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [tasks, setTasks] = useState<
    { itemID: number; description: string; time: string; mark: boolean }[]
  >([]);
  const [newTask, setNewTask] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskDescription, setEditedTaskDescription] = useState("");

  useEffect(() => {
    if (id) {
      loadTasks();
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

  return (
    <div>
      <h1>Task List</h1>
      <button onClick={() => navigate("/home")}>Back to Lists</button>

      <h3>Tasks:</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.itemID}>
            <input
              type="checkbox"
              checked={task.mark}
              onChange={() => handleMarkTask(task.itemID, task.mark)}
            />
            {editingTaskId === task.itemID ? (
              <>
                <input
                  type="text"
                  value={editedTaskDescription}
                  onChange={(e) => setEditedTaskDescription(e.target.value)}
                />
                <input
                  type="date"
                  value={taskTime || task.time} 
                  onChange={(e) => setTaskTime(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(task.itemID)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.mark ? "line-through" : "none",
                  }}
                >
                  <p>{task.description}</p>
                  <p>{formatDate(task.time)}</p>
                </span>
                <button
                  onClick={() => handleEditTask(task.itemID, task.description)}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteTask(task.itemID)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3>Add a Task:</h3>
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
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default TaskPage;
