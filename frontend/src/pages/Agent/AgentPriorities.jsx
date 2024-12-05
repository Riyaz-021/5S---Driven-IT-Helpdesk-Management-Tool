import React, { useEffect, useState } from "react";
import axios from "axios";
import AgentSidebar from "./AgentSidebar";
import styles from "./AgentPriorities.module.css";

const AgentPriorities = () => {
  const [stats, setStats] = useState({
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  });

  const [sortOrder, setSortOrder] = useState("asc");

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/helpdesk/agent_priorities",
          {
            withCredentials: true,
          }
        );
        const data = response.data;

        const highPriority = data.filter(
          (ticket) => ticket.priority === "High"
        ).length;
        const mediumPriority = data.filter(
          (ticket) => ticket.priority === "Medium"
        ).length;
        const lowPriority = data.filter(
          (ticket) => ticket.priority === "Low"
        ).length;

        setStats({ highPriority, mediumPriority, lowPriority });
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const sortTickets = () => {
    const sortedTickets = [...tickets].sort((a, b) => {
      const priorities = { High: 3, Medium: 2, Low: 1 }; // Priority values
      return sortOrder === "asc"
        ? priorities[a.priority] - priorities[b.priority]
        : priorities[b.priority] - priorities[a.priority];
    });

    setTickets(sortedTickets);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className={styles.agentDashboard}>
      <AgentSidebar />
      <div className={styles.agentContent}>
        <h1 className={styles.agentTitle}>Ticket Priorities</h1>
        {/* Stat Boxes */}
        <div className={styles.priorityStats}>
          <div className={`${styles.statBox} ${styles.priorityHighBox}`}>
            <h3>High Priority</h3>
            <p>{stats.highPriority}</p>
          </div>
          <div className={`${styles.statBox} ${styles.priorityMediumBox}`}>
            <h3>Medium Priority</h3>
            <p>{stats.mediumPriority}</p>
          </div>
          <div className={`${styles.statBox} ${styles.priorityLowBox}`}>
            <h3>Low Priority</h3>
            <p>{stats.lowPriority}</p>
          </div>
        </div>
        {/* Tickets Table */}
        <table className={styles.agentTicketTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th onClick={sortTickets} className={styles.sortableColumn}>
                Priority
                <span className={styles.sortIcon}>
                  {sortOrder === "asc" ? "▲" : "▼"}
                </span>
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket._id}</td>
                <td>{ticket.title}</td>
                <td className={styles[`priority${ticket.priority}`]}>
                  {ticket.priority}
                </td>
                <td>{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentPriorities;
