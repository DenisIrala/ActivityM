import { FC, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Sidebar.css";

interface SidebarProps {
  username: string | null;
  onLogout: () => void;
}

const Sidebar: FC<SidebarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="logo">
          <a href="https://github.com/DenisIrala/ActivityM" target="_blank">
            Activity<span className="manager">Manager</span>
          </a>
        </div>
        <ul className="nav-list">
          <li
            className={location.pathname === "/home" ? "active" : ""}
            onClick={() => navigate("/home")}
          >
            ☑️ Home
          </li>
          <li
            className={location.pathname === "/deadlines" ? "active" : ""}
            onClick={() => navigate("/deadlines")}
          >
            🗓️ Deadlines
          </li>
          <li onClick={onLogout}>🔚 Logout</li>
        </ul>
      </div>
      {isOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
