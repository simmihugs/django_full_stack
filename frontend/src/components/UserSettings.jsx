import React, { useState, useRef, useEffect } from "react";
import { FaLock, FaEnvelope, FaTimes } from "react-icons/fa";
import api from "../api";
import "../styles/UserSettings.css";

function UserSettings({ onClose, currentEmail }) {
  const [activeTab, setActiveTab] = useState("password");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [displayedEmail, setDisplayedEmail] = useState(currentEmail);
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

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = () => {
    return newPassword.length >= 8 && newPassword === confirmPassword;
  };

  const handlePasswordChange = async () => {
    try {
      await api.post("/api/user/change-password/", {
        new_password: newPassword,
        old_password: oldPassword,
      });
      alert("Password changed successfully");
      setNewPassword("");
      setConfirmPassword("");
      setOldPassword("");
    } catch (error) {
      alert("Failed to change password");
    }
  };

  const handleEmailChange = async () => {
    try {
      await api.post("/api/user/change-email/", {
        new_email: newEmail,
        current_password: currentPassword,
      });
      alert("Email changed successfully");
      setDisplayedEmail(newEmail);
      setNewEmail("");
      setCurrentPassword("");
    } catch (error) {
      alert("Failed to change email");
    }
  };
  console.log("FaTimes:", FaTimes);

  return (
    <div className="settings-overlay">
      <div className="settings-modal" ref={modalRef}>
        <button className="close-btn" onClick={onClose}>
          <div>
            <FaTimes />
          </div>
        </button>

        <div className="settings-sidebar">
          <div
            className={`settings-tab ${
              activeTab === "password" ? "active" : ""
            }`}
            onClick={() => setActiveTab("password")}
          >
            <FaLock /> Password
          </div>
          <div
            className={`settings-tab ${activeTab === "email" ? "active" : ""}`}
            onClick={() => setActiveTab("email")}
          >
            <FaEnvelope /> Email
          </div>
        </div>
        <div className="settings-content">
          {activeTab === "password" && (
            <div className="password-change">
              <h2>Change Password</h2>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Current Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button
                onClick={handlePasswordChange}
                disabled={!isValidPassword() || !oldPassword}
              >
                Apply
              </button>
            </div>
          )}
          {activeTab === "email" && (
            <div className="email-change">
              <h2>Change Email</h2>
              <p>Current Email: {displayedEmail}</p>
              <input
                type="email"
                placeholder="New Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                onClick={handleEmailChange}
                disabled={!isValidEmail(newEmail) || !currentPassword}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSettings;
