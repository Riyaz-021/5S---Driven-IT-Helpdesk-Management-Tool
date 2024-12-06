import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar.jsx";
import TicketsPieChart from "./TicketsPieChart";
import axios from "axios";
import styles from "./UserDashboard.module.css";

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    pendingTickets: 0,
    resolvedTickets: 0,
    highPriority: 0,
  });
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const stats = await axios.get(
          "http://localhost:3000/helpdesk/user_dashboard",
          {
            withCredentials: true,
          }
        );
        setStats(stats.data);

        const userProfile = await axios.get(
          "http://localhost:3000/helpdesk/user_profile",
          {
            withCredentials: true,
          }
        );
        setUsername(userProfile.data.username);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Error loading dashboard data:", err);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className={styles.userDashboard}>
      <UserSidebar />
      <div className={styles.dashboardContent}>
        <h1 className={styles.dashboardTitle}>User Dashboard</h1>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.statsContainer}>
          <div className={`${styles.statCard} ${styles.totalTickets}`}>
            <h2>{stats.totalTickets}</h2>
            <p>Total Tickets</p>
          </div>
          <div className={`${styles.statCard} ${styles.highPriority}`}>
            <h2>{stats.highPriority}</h2>
            <p>High Priority</p>
          </div>
          <div className={`${styles.statCard} ${styles.pending}`}>
            <h2>{stats.pendingTickets}</h2>
            <p>Pending Tickets</p>
          </div>
          <div className={`${styles.statCard} ${styles.resolved}`}>
            <h2>{stats.resolvedTickets}</h2>
            <p>Resolved Tickets</p>
          </div>
        </div>

        <div className={styles.mainSection}>
          <div className={styles.welcomeSection}>
            <h2>Welcome, {username}!</h2>
            <p>We’re glad to have you here.</p>
            <p>
              <strong>Note:</strong> If this is your first login, please update
              your password from the <strong>Settings</strong> tab for security.
            </p>
          </div>
          <div className={styles.chartsSection}>
            <div className={styles.chart}>
              <TicketsPieChart stats={stats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
