import React, { useState } from "react";
import axios from "axios";
import DashboardSidebar from "./UserSidebar";
import styles from "./UserSettings.module.css";

const UserSettings = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const usernameRegex = /^[A-Za-z]/;
    if (!usernameRegex.test(formData.username)) {
      setError("Username must start with a letter.");
      return;
    }
    try {
      const response = await axios.patch(
        "http://localhost:3000/helpdesk/user/settings",
        formData,
        { withCredentials: true }
      );
      setMessage(response.data.message);
    } catch (err) {
      console.error(
        "Error updating settings:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to update settings.");
    }
  };

  return (
    <div className={styles.settingsPage}>
      <DashboardSidebar />
      <div className={styles.settingsContent}>
        <h1>Settings</h1>
        <form onSubmit={handleSubmit} className={styles.settingsForm}>
          <label>
            New Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter new username"
              className={styles.input}
            />
          </label>
          <label>
            New Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className={styles.input}
            />
          </label>
          {message && <p className={styles.success}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitButton}>
            Update Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
