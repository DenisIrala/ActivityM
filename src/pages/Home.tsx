import { FC, useEffect, useState } from "react";
import { clearAuth } from "../authUtils";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/apiService";
import axios from "axios";

const Home: FC = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState<{ listID: number; listName: string }[]>(
    []
  );
  const [newListName, setNewListName] = useState("");
  const [editingListId, setEditingListId] = useState<number | null>(null);
  const [editedListName, setEditedListName] = useState("");

  var token = localStorage.getItem("token");
  var username = localStorage.getItem("username");

  const fetchLists = async () => {
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

      setLists(response.data);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  useEffect(() => {
    token = localStorage.getItem("token");
    username = localStorage.getItem("username");
    fetchLists();
    document.title = "ActivityM";
    return () => {
      document.title = "";
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/", { replace: true });
  };

  const handleAddList = async () => {
    console.log(username);
    console.log(token);
    if (!newListName.trim()) return;

    try {
      await apiRequest("POST", "addList", { name: newListName, token });
      console.log("List added successfully!");
      setNewListName("");
      fetchLists();
    } catch (error) {
      console.error("Error adding list:", error);
    }
  };

  const handleRemoveList = async (id: number) => {
    try {
      await apiRequest("DELETE", `deleteList/${id}/${token}`);
      console.log("List deleted successfully!");
      fetchLists();
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const handleEditList = (id: number, currentName: string) => {
    setEditingListId(id);
    setEditedListName(currentName);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editedListName.trim()) return;
    try {
      await apiRequest("PUT", "updateList", {
        listID: id,
        token,
        newName: editedListName,
      });

      console.log("List updated successfully!");

      setLists((prevLists) =>
        prevLists.map((list) =>
          list.listID === id ? { ...list, listName: editedListName } : list
        )
      );

      setEditingListId(null);
      setEditedListName("");

      setTimeout(fetchLists, 800);
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };


  return (
    <div>
      <h1>Home Page</h1>
      <h2>Welcome, {username}!</h2>

      <h3>Your Lists:</h3>
      <ul>
        {lists.map((list) => (
          <li key={list.listID}>
            {editingListId === list.listID ? (
              <>
                <input
                  type="text"
                  value={editedListName}
                  onChange={(e) => setEditedListName(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(list.listID)}>
                  Save
                </button>
              </>
            ) : (
              <>
                {/* Clicking on a list navigates to /list/:id */}
                <span
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: "blue",
                  }}
                  onClick={() => navigate(`/list/${list.listID}`)}
                >
                  {list.listName}
                </span>
                <button
                  onClick={() => handleEditList(list.listID, list.listName)}
                >
                  Edit
                </button>
                <button onClick={() => handleRemoveList(list.listID)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Enter new list name"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
      />
      <button onClick={handleAddList}>Add List</button>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
