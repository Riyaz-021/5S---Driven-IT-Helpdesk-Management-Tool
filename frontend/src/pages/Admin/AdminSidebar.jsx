import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./AdminSidebar.module.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/helpdesk/logout", {
        withCredentials: true,
      });
      navigate("/helpdesk/login");
      window.location.reload();
    } catch (error) {
      console.error(
        "Error logging out:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    // Update activeTab whenever the path changes
    setActiveTab(location.pathname);
  }, [location]);

  const handleTabClick = (path) => {
    setActiveTab(path); // Update the activeTab state
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.brand}>IT - HelpDesk</div>
      <br />
      <br />
      <br />
      <div className={styles.links}>
        <Link
          to="/helpdesk/admin_dashboard"
          onClick={() => handleTabClick("/helpdesk/admin_dashboard")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/admin_dashboard" ? styles.active : ""
          }`}
        >
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </Link>
        <br />
        <Link
          to="/helpdesk/admin_tickets"
          onClick={() => handleTabClick("/helpdesk/admin_tickets")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/admin_tickets" ? styles.active : ""
          }`}
        >
          <i className="fas fa-ticket-alt"></i> Tickets
        </Link>
        <br />
        <Link
          to="/helpdesk/admin_priorities"
          onClick={() => handleTabClick("/helpdesk/admin_priorities")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/admin_priorities" ? styles.active : ""
          }`}
        >
          <i className="fas fa-exclamation-circle"></i> Priorities
        </Link>
        <br />
        <Link
          to="/helpdesk/admin_statuses"
          onClick={() => handleTabClick("/helpdesk/admin_statuses")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/admin_statuses" ? styles.active : ""
          }`}
        >
          <i className="fas fa-tasks"></i> Statuses
        </Link>
        <br />
        <Link
          to="/helpdesk/admin/users"
          onClick={() => handleTabClick("/helpdesk/admin/users")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/admin/users" ? styles.active : ""
          }`}
        >
          <i className="fas fa-users"></i> User Management
        </Link>
        <br />
        <Link
          to="/helpdesk/admin_settings"
          onClick={() => handleTabClick("/helpdesk/admin_settings")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/admin_settings" ? styles.active : ""
          }`}
        >
          <i className="fa-solid fa-gear"></i> Settings
        </Link>
        <br />
        <button onClick={handleLogout} className={styles.signOutBtn}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
