import { FC, useEffect, useState } from "react";
import { clearAuth, isValidToken } from "../authUtils";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Mock API data
// const mockLists = [
//   { listID: 1, ListName: "Groceries", SharedIDs: [2, 3] },
//   { listID: 2, ListName: "Work Tasks", SharedIDs: [1] },
// ];

const Home: FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string } | null>(null);
  // const [lists, setLists] =
  //   useState<{ listID: number; ListName: string; SharedIDs: number[] }[]>(
  //     mockLists
  //   );
  const [lists, setLists] = useState<{ listID: number; listName: string }[]>(
    []
  ); // Initialize as empty array
  const [newListName, setNewListName] = useState("");
  const [editingListId, setEditingListId] = useState<number | null>(null);
  const [editedListName, setEditedListName] = useState("");

  const token = localStorage.getItem("token");

  // console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

  const fetchLists = async () => {
    try {
      const ownerID = localStorage.getItem("ownerID");
      if (!ownerID) {
        console.error("Error: ownerID is missing.");
        return;
      }

      const apiUrl = `${
        import.meta.env.VITE_API_BASE_URL || ""
      }/getLists?ownerID=${ownerID}`;
      // console.log("Making API request to:", apiUrl);

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log("Fetched lists:", response.data);
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
    const checkAuth = async () => {
      try {
        setUser({ username: "TestUser" });
        await fetchLists();
      } catch (error) {
        handleLogout();
      }
    };

    if (!isValidToken(token)) {
      clearAuth();
      navigate("/", { replace: true });
    } else {
      checkAuth();
    }
  }, [navigate, token]);

  const handleLogout = () => {
    clearAuth();
    navigate("/", { replace: true });
  };

  const handleAddList = () => {
    if (!newListName.trim()) return; 

    const newList = {
      listID: lists.length + 1,
      listName: newListName,
      SharedIDs: [],
    };

    setLists([...lists, newList]);
    setNewListName("");
  };

  const handleRemoveList = (id: number) => {
    setLists(lists.filter((list) => list.listID !== id));
  };

  const handleEditList = (id: number, currentName: string) => {
    setEditingListId(id);
    setEditedListName(currentName);
  };

  const handleSaveEdit = (id: number) => {
    setLists(
      lists.map((list) =>
        list.listID === id ? { ...list, ListName: editedListName } : list
      )
    );
    setEditingListId(null);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Home Page</h1>
      <h2>Welcome, {user.username}!</h2>

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
                {list.listName}
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

      {/* Add List Section */}
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
