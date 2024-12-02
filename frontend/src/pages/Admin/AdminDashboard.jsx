import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import TicketMetricsBarChart from "./TicketMetricsBarChart";
import TicketMetricsLineChart from "./TicketMetricsLineChart";
import TicketMetricsDonutChart from "./TicketMetricsDonutChart";
import axios from "axios";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState("bar");
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/helpdesk/admin_dashboard",
          { withCredentials: true }
        );
        const formattedData = [
          { name: "Open Tickets", count: response.data.openTickets },
          { name: "Pending Tickets", count: response.data.pendingTickets },
          { name: "Resolved Tickets", count: response.data.resolvedTickets },
        ];
        setMetrics(formattedData);
      } catch (err) {
        console.error(
          "Error fetching metrics:",
          err.response?.data || err.message
        );
        setError("Failed to load metrics");
      }
    };

    fetchMetrics();
  }, []);

  const handleChartChange = (event) => {
    setSelectedChart(event.target.value);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <AdminSidebar />
      <div className={styles.content}>
        <h1 className={styles.heading}>Admin Dashboard</h1>
        <div className={styles.cardContainer}>
          <div className={`${styles.card} ${styles.open}`}>
            <h2>Open Tickets</h2>
            <p>{metrics.find((m) => m.name === "Open Tickets")?.count || 0}</p>
          </div>
          <div className={`${styles.card} ${styles.pending}`}>
            <h2>Pending Tickets</h2>
            <p>
              {metrics.find((m) => m.name === "Pending Tickets")?.count || 0}
            </p>
          </div>
          <div className={`${styles.card} ${styles.resolved}`}>
            <h2>Resolved Tickets</h2>
            <p>
              {metrics.find((m) => m.name === "Resolved Tickets")?.count || 0}
            </p>
          </div>
        </div>
        <div className={styles.chartSelector}>
          <label htmlFor="chartType">Select Chart: </label>
          <select
            id="chartType"
            value={selectedChart}
            onChange={handleChartChange}
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="donut">Donut Chart</option>
          </select>
        </div>
        <div className={styles.chartContainer}>
          {selectedChart === "bar" && <TicketMetricsBarChart data={metrics} />}
          {selectedChart === "line" && (
            <TicketMetricsLineChart data={metrics} />
          )}
          {selectedChart === "donut" && (
            <TicketMetricsDonutChart data={metrics} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
