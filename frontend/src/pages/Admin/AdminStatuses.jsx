import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import styles from "./AdminStatuses.module.css";

const AdminStatuses = () => {
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  const [tickets, setTickets] = useState([]);
  const [statusSortOrder, setStatusSortOrder] = useState("asc");

  useEffect(() => {
    axios.get("http://localhost:3000/helpdesk/admin_statuses").then((res) => {
      const data = res.data;

      const open = data.filter((ticket) => ticket.status === "Open").length;
      const assigned = data.filter(
        (ticket) => ticket.status === "Assigned"
      ).length;
      const inProgress = data.filter(
        (ticket) => ticket.status === "In Progress"
      ).length;
      const resolved = data.filter(
        (ticket) => ticket.status === "Resolved"
      ).length;
      const closed = data.filter((ticket) => ticket.status === "Closed").length;

      setStats({ open, assigned, inProgress, resolved, closed });
      setTickets(data);
    });
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
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className={styles.adminContent}>
        <h1 className={styles.adminTitle}>Ticket Statuses</h1>
        {/* Stat Boxes */}
        <div className={styles.statusStats}>
          <div className={`${styles.statBox} ${styles.openBox}`}>
            <h3>Open</h3>
            <p>{stats.open}</p>
          </div>
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
        <table className={styles.adminTicketTable}>
          <thead>
            <tr>
              <th>Ticket ID</th>
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
                  className={styles[`status${ticket.status.replace(" ", "")}`]}
                >
                  {ticket.status}
                </td>
                <td className={styles[`priority${ticket.priority}`]}>
                  {ticket.priority}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStatuses;
