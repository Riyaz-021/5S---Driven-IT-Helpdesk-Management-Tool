import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./AgentSidebar.module.css";

const AgentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [activeTab, setActiveTab] = useState(location.pathname); // Initialize with current path

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
          to="/helpdesk/agent_dashboard"
          onClick={() => handleTabClick("/helpdesk/agent_dashboard")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/agent_dashboard" ? styles.active : ""
          }`}
        >
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </Link>
        <br />
        <Link
          to="/helpdesk/agent_tickets"
          onClick={() => handleTabClick("/helpdesk/agent_tickets")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/agent_tickets" ? styles.active : ""
          }`}
        >
          <i className="fas fa-ticket-alt"></i> MyTickets
        </Link>
        <br />
        <Link
          to="/helpdesk/agent_priorities"
          onClick={() => handleTabClick("/helpdesk/agent_priorities")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/agent_priorities" ? styles.active : ""
          }`}
        >
          <i className="fas fa-exclamation-circle"></i> Priorities
        </Link>
        <br />
        <Link
          to="/helpdesk/agent_statuses"
          onClick={() => handleTabClick("/helpdesk/agent_statuses")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/agent_statuses" ? styles.active : ""
          }`}
        >
          <i className="fas fa-tasks"></i> Statuses
        </Link>
        <br />
        <Link
          to="/helpdesk/agent_settings"
          onClick={() => handleTabClick("/helpdesk/agent_settings")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/agent_settings" ? styles.active : ""
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

export default AgentSidebar;
