import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./AddUser.module.css";
import AdminSidebar from "./AdminSidebar";

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "User", // Default role
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usernameRegex = /^[A-Za-z]/;
    if (!usernameRegex.test(formData.username)) {
      setError("Username must start with a letter.");
      return;
    }
    try {
      await axios.post("http://localhost:3000/helpdesk/admin/users", formData, {
        withCredentials: true,
      });
      navigate("/helpdesk/admin/users");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user.");
      console.error("Error creating user:", err);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <AdminSidebar />
      <div className={styles.content}>
        <h1>Create New User</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.addUserForm}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Role:
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="Admin">Admin</option>
              <option value="Agent">Agent</option>
              <option value="User">User</option>
            </select>
          </label>
          <button type="submit" className={styles.submitButton}>
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
