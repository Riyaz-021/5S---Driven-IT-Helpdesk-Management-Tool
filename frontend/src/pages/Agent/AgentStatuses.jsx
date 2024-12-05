import React, { useEffect, useState } from "react";
import axios from "axios";
import AgentSidebar from "./AgentSidebar";
import styles from "./AgentStatuses.module.css";

const AgentStatuses = () => {
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  const [tickets, setTickets] = useState([]);
  const [statusSortOrder, setStatusSortOrder] = useState("asc");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/helpdesk/agent_statuses",
          {
            withCredentials: true,
          }
        );
        const data = response.data;

        // Calculate statistics
        const assigned = data.filter(
          (ticket) => ticket.status === "Assigned"
        ).length;
        const inProgress = data.filter(
          (ticket) => ticket.status === "In Progress"
        ).length;
        const resolved = data.filter(
          (ticket) => ticket.status === "Resolved"
        ).length;
        const closed = data.filter(
          (ticket) => ticket.status === "Closed"
        ).length;

        setStats({ assigned, inProgress, resolved, closed });
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const sortByStatus = () => {
    const statuses = {
      Open: 1,
      Assigned: 2,
      "In Progress": 3,
      Resolved: 4,
      Closed: 5,
    };
    const sortedTickets = [...tickets].sort((a, b) =>
      statusSortOrder === "asc"
        ? statuses[a.status] - statuses[b.status]
        : statuses[b.status] - statuses[a.status]
    );
    setTickets(sortedTickets);
    setStatusSortOrder(statusSortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className={styles.adminDashboard}>
      <AgentSidebar />
      <div className={styles.adminContent}>
        <h1 className={styles.adminTitle}>Ticket Statuses</h1>
        {/* Stat Boxes */}
        <div className={styles.statusStats}>
          <div className={`${styles.statBox} ${styles.assigned}`}>
            <h3>Assigned</h3>
            <p>{stats.assigned}</p>
          </div>
          <div className={`${styles.statBox} ${styles.inProgressBox}`}>
            <h3>In Progress</h3>
            <p>{stats.inProgress}</p>
          </div>
          <div className={`${styles.statBox} ${styles.resolvedBox}`}>
            <h3>Resolved</h3>
            <p>{stats.resolved}</p>
          </div>
          <div className={`${styles.statBox} ${styles.closedBox}`}>
            <h3>Closed</h3>
            <p>{stats.closed}</p>
          </div>
        </div>
        {/* Tickets Table */}
        <table className={styles.adminTicketTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th onClick={sortByStatus} className={styles.sortableColumn}>
                Status
                <span className={styles.sortIcon}>
                  {statusSortOrder === "asc" ? "▲" : "▼"}
                </span>
              </th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket._id}</td>
                <td>{ticket.title}</td>
                <td
                  className={
                    styles[`status${ticket.status.replace(/\s+/g, "")}`]
                  }
                >
                  {ticket.status}
                </td>
                <td>{ticket.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentStatuses;
