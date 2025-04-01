import { useNavigate } from "react-router-dom";
import "../css/Sidebar.css";

interface SidebarProps {
  username: string | null;
  onLogout: () => void;
}

const Sidebar = ({ onLogout }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="logo">ActivityM</div>
      <ul className="nav-list">
        <li onClick={() => navigate(`/home`)}>Home</li>
        <li onClick={() => navigate(`/deadlines`)}>Deadlines</li>
        <li onClick={onLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;
