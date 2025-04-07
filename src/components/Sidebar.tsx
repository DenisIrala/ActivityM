import { FC } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Sidebar.css";

interface SidebarProps {
  username: string | null;
  onLogout: () => void;
}

const Sidebar: FC<SidebarProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="logo">
        <a href="https://github.com/DenisIrala/ActivityM" target="_blank">
          activity
          <span className="manager">manager</span>
        </a>
      </div>
      <ul className="nav-list">
        <li onClick={() => navigate("/home")}>Home</li>
        <li onClick={() => navigate("/deadlines")}>Deadlines</li>
        <li onClick={onLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;
