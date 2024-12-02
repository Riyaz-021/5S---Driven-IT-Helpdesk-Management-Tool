import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import styles from "./AdminPriorities.module.css";

const AdminPriorities = () => {
  const [stats, setStats] = useState({
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  });

  const [sortOrder, setSortOrder] = useState("asc");

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/helpdesk/admin_priorities").then((res) => {
      const data = res.data;

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
    });
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

  const togglePriority = async (ticketId, currentPriority) => {
    const nextPriority =
      currentPriority === "Low"
        ? "Medium"
        : currentPriority === "Medium"
        ? "High"
        : "Low";

    try {
      const response = await axios.patch(
        `http://localhost:3000/helpdesk/admin_priorities/${ticketId}`,
        { priority: nextPriority }
      );

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId
            ? { ...ticket, priority: nextPriority }
            : ticket
        )
      );

      console.log(response.data.message);
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  return (
    <div className={styles.adminDashboard}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className={styles.adminContent}>
        <h1 className={styles.adminTitle}>Ticket Priorities</h1>
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
        <table className={styles.adminTicketTable}>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title</th>
              <th onClick={sortTickets} className={styles.sortableColumn}>
                Priority
                <span className={styles.sortIcon}>
                  {sortOrder === "asc" ? "▲" : "▼"}
                </span>
              </th>
              <th>Status</th>
              <th>Actions</th>
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
                <td>
                  <button
                    className={`${styles.actionButton} ${styles.reprioritizeButton}`}
                    onClick={() => togglePriority(ticket._id, ticket.priority)}
                  >
                    Reprioritize
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPriorities;
