import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar.jsx";
import SearchBar from "../SearchBar";
import styles from "./UserManagement.module.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ admins: 0, users: 0, agents: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/helpdesk/admin/users")
      .then((response) => {
        const usersData = response.data;
        setUsers(usersData);

        // Calculate stats based on roles
        const admins = usersData.filter((user) => user.role === "Admin").length;
        const regularUsers = usersData.filter(
          (user) => user.role === "User"
        ).length;
        const agents = usersData.filter((user) => user.role === "Agent").length;

        setStats({ admins, users: regularUsers, agents });
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleAddUser = () => {
    navigate("/helpdesk/admin/add_user");
  };

  const handleEditUser = (userId) => {
    navigate(`/helpdesk/admin/users/${userId}/edit`);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:3000/helpdesk/admin/users/${userId}`)
        .then(() => setUsers(users.filter((user) => user._id !== userId)))
        .catch((error) => console.error("Error deleting user:", error));
    }
  };

  useEffect(() => {
    const filtered = users.filter((user) => {
      return (
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLocaleLowerCase())
      );
    });

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  return (
    <div className={styles.adminDashboard}>
      <AdminSidebar />

      <div className={styles.adminContent}>
        <h1 className={styles.adminTitle}>User Management</h1>

        {/* Stat Boxes */}
        <div className={styles.userStats}>
          <div className={`${styles.statBox} ${styles.adminBox}`}>
            <h3>Admins</h3>
            <p>{stats.admins}</p>
          </div>
          <div className={`${styles.statBox} ${styles.userBox}`}>
            <h3>Users</h3>
            <p>{stats.users}</p>
          </div>
          <div className={`${styles.statBox} ${styles.agentBox}`}>
            <h3>Agents</h3>
            <p>{stats.agents}</p>
          </div>
        </div>
        <div className={styles.headerRow}>
          <button className={styles.adminAddBtn} onClick={handleAddUser}>
            Add New User
          </button>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search by Name, ID or Role"
          />
        </div>
        <table className={styles.adminUserTable}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className={styles.adminEditBtn}
                    onClick={() => handleEditUser(user._id)}
                  >
                    Edit
                  </button>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <button
                    className={styles.adminDeleteBtn}
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
