import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AgentSidebar.module.css";

const AgentSidebar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(""); // State to track the active tab

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

  const handleTabClick = (tabName) => {
    setActiveTab(tabName); // Set the clicked tab as active
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
          onClick={() => handleTabClick("dashboard")}
          className={`${styles.link} ${
            activeTab === "dashboard" ? styles.active : ""
          }`}
        >
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </Link>
        <br />
        <Link
          to="/helpdesk/agent_tickets"
          onClick={() => handleTabClick("tickets")}
          className={`${styles.link} ${
            activeTab === "tickets" ? styles.active : ""
          }`}
        >
          <i className="fas fa-ticket-alt"></i> MyTickets
        </Link>
        <br />
        <Link
          to="/helpdesk/agent_priorities"
          onClick={() => handleTabClick("priorities")}
          className={`${styles.link} ${
            activeTab === "priorities" ? styles.active : ""
          }`}
        >
          <i className="fas fa-exclamation-circle"></i> Priorities
        </Link>
        <br />
        <Link
          to="/helpdesk/a_statuses"
          onClick={() => handleTabClick("statuses")}
          className={`${styles.link} ${
            activeTab === "statuses" ? styles.active : ""
          }`}
        >
          <i className="fas fa-tasks"></i> Statuses
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
