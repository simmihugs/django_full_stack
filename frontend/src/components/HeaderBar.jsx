import { useState } from "react";
import logo from "/waehly.svg";
import "../styles/HeaderBar.css";
import { FaCog } from "react-icons/fa";
import UserSettings from "./UserSettings";

function HeaderBar({ username, onLogout }) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="left-section"></div>
        <div className="right-section">
          <img src={logo} alt="Logo" className="logo" />
          <span className="username">{username}</span>
          <button
            className="settings-btn"
            onClick={() => setShowSettings(true)}
          >
            <FaCog />
          </button>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
      {showSettings && <UserSettings onClose={() => setShowSettings(false)} />}
    </header>
  );
}

export default HeaderBar;
