import React, { useState, useEffect } from "react";
import axios from "axios";
import AgentSidebar from "./AgentSidebar";
import styles from "./AgentDashboard.module.css";
import TicketMetricsBarChart from "./AgentTicketMetricsBarChart";

const AgentDashboard = () => {
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/helpdesk/agent_dashboard",
          { withCredentials: true }
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { label: "Assigned", value: stats.assigned, color: "#3498db" },
    { label: "In Progress", value: stats.inProgress, color: "#f39c12" },
    { label: "Resolved", value: stats.resolved, color: "#27ae60" },
  ];

  return (
    <div className={styles.dashboard}>
      <AgentSidebar />
      <div className={styles.content}>
        <h1 className={styles.heading}>Agent Dashboard</h1>
        <div className={styles.cardContainer}>
          <div className={`${styles.card} ${styles.assigned}`}>
            <h2>Assigned Tickets</h2>
            <p>{stats.assigned}</p>
          </div>
          <div className={`${styles.card} ${styles.inProgress}`}>
            <h2>In Progress Tickets</h2>
            <p>{stats.inProgress}</p>
          </div>
          <div className={`${styles.card} ${styles.resolved}`}>
            <h2>Resolved Tickets</h2>
            <p>{stats.resolved}</p>
          </div>
        </div>
        <div className={styles.chartContainer}>
          <TicketMetricsBarChart data={chartData} title="Ticket Statistics" />
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
