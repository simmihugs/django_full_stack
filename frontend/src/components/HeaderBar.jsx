import logo from "/waehly.svg";
import "../styles/HeaderBar.css";

function HeaderBar({ username, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="left-section"></div>
        <div className="right-section">
          <img src={logo} alt="Logo" className="logo" />
          <span className="username">{username}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderBar;
