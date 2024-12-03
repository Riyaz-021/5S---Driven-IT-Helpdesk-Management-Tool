import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AgentSidebar.module.css";

const AgentSidebar = () => {
  const navigate = useNavigate();

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

  return (
    <div className={styles.sidebar}>
      <div className={styles.brand}>IT - HelpDesk</div>
      <br />
      <br />
      <br />
      <div className={styles.links}>
        <Link to="/helpdesk/agent_dashboard" className={styles.link}>
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </Link>
        <br />
        <Link to="/helpdesk/agent_tickets" className={styles.link}>
          <i className="fas fa-ticket-alt"></i> MyTickets
        </Link>
        <br />
        <Link to="/helpdesk/agent_priorities" className={styles.link}>
          <i className="fas fa-exclamation-circle"></i> Priorities
        </Link>
        <br />
        <Link to="/helpdesk/agent_statuses" className={styles.link}>
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
