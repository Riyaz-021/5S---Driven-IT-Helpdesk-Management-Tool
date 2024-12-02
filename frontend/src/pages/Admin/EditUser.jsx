import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EditUser.module.css";
import AdminSidebar from "./AdminSidebar";

const EditUser = () => {
  const { id } = useParams(); // Get user ID from the URL
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/helpdesk/admin/users/${id}`,
          { withCredentials: true }
        );
        setUser(response.data);
        setRole(response.data.role);
      } catch (err) {
        setError("Failed to fetch user details.");
        console.error(err);
      }
    };

    fetchUser();
  }, [id]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:3000/helpdesk/admin/users/${id}`,
        { role },
        { withCredentials: true }
      );
      navigate("/helpdesk/admin/users");
    } catch (err) {
      setError("Failed to update user role.");
      console.error(err);
    }
  };

  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <div className={styles.content}>
        <h1>Edit User</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.editUserForm}>
          <label>
            UserId:
            <input type="text" value={user._id} disabled />
          </label>
          <label>
            Username:
            <input type="text" value={user.username} disabled />
          </label>
          <label>
            Role:
            <select value={role} onChange={handleRoleChange} required>
              <option value="Admin">Admin</option>
              <option value="Agent">Agent</option>
              <option value="User">User</option>
            </select>
          </label>
          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
