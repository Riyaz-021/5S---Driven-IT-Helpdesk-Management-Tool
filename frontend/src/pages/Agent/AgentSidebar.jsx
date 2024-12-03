import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./AgentSidebar.module.css";

const AgentSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>Agent Panel</h2>
      <nav className={styles.navLinks}>
        <NavLink
          to="/helpdesk/agent_dashboard"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/helpdesk/agent_tickets"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          My Tickets
        </NavLink>
        <NavLink
          to="/helpdesk/agent_profile"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Profile
        </NavLink>
        <NavLink
          to="/helpdesk/agent_logout"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default AgentSidebar;
