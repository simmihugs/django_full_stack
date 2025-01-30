import { useState, useRef, useEffect } from "react";
import api from "../api";
import "../styles/UserSettings.css";

function UserSettings({ onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/user/change-password/", {
        new_password: newPassword,
      });
      alert("Password changed successfully");
      onClose();
    } catch (error) {
      alert("Failed to change password");
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/user/change-email/", { new_email: newEmail });
      alert("Email changed successfully");
      onClose();
    } catch (error) {
      alert("Failed to change email");
    }
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal" ref={modalRef}>
        <h2>User Settings</h2>
        <form onSubmit={handlePasswordChange}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">Change Password</button>
        </form>
        <form onSubmit={handleEmailChange}>
          <input
            type="email"
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button type="submit">Change Email</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default UserSettings;
