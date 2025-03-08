import { FC, useEffect, useState } from "react";
import { clearAuth, isValidToken } from "../authUtils";
import { useNavigate } from "react-router-dom";

// Mock API data
const mockLists = [
  { listID: 1, ListName: "Groceries", SharedIDs: [2, 3] },
  { listID: 2, ListName: "Work Tasks", SharedIDs: [1] },
];

const Home: FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [lists, setLists] =
    useState<{ listID: number; ListName: string; SharedIDs: number[] }[]>(
      mockLists
    );
  const [newListName, setNewListName] = useState("");
  const [editingListId, setEditingListId] = useState<number | null>(null);
  const [editedListName, setEditedListName] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulating fetching user data
        setUser({ username: "TestUser" });

        // Simulating fetching lists (Replace with real API call later)
        setLists(mockLists);
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
    if (!newListName.trim()) return; // Prevent adding empty lists

    const newList = {
      listID: lists.length + 1, // Temporary ID (backend will handle real IDs)
      ListName: newListName,
      SharedIDs: [], // Assume no shared users initially
    };

    setLists([...lists, newList]); // Update state
    setNewListName(""); // Clear input
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
    setEditingListId(null); // Exit edit mode
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
                {list.ListName}
                <button
                  onClick={() => handleEditList(list.listID, list.ListName)}
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
