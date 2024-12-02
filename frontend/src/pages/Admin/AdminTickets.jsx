import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import styles from "./AdminTickets.module.css";
import SearchBar from "../SearchBar";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getPriorityClass = (priority) => {
    if (priority === "High") return styles.priorityHigh;
    if (priority === "Medium") return styles.priorityMedium;
    if (priority === "Low") return styles.priorityLow;
  };

  const getStatusClass = (status) => {
    if (status === "Open") return styles.statusOpen;
    if (status === "Assigned") return styles.statusAssigned;
    if (status === "In Progress") return styles.statusInProgress;
    if (status === "Resolved") return styles.statusResolved;
    if (status === "Closed") return styles.statusClosed;
  };

  const handleAssignAgent = (ticketId) => {
    navigate(`/helpdesk/admin/tickets/${ticketId}/assign`);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/helpdesk/admin_tickets",
          {
            withCredentials: true,
          }
        );
        setTickets(response.data);
        setFilteredTickets(response.data);
      } catch (err) {
        console.error(
          "Error fetching tickets:",
          err.response?.data || err.message
        );
        setError("Failed to load tickets");
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    const filtered = tickets.filter((ticket) => {
      return (
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setFilteredTickets(filtered);
  }, [searchQuery, tickets]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.adminDashboard}>
      <AdminSidebar />
      <div className={styles.adminContent}>
        <h1 className={styles.adminTitle}>All Tickets</h1>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by Title or ID"
        />
        <table className={styles.adminTicketTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket._id}</td>
                <td>{ticket.title}</td>
                <td className={getPriorityClass(ticket.priority)}>
                  {ticket.priority}
                </td>
                <td className={getStatusClass(ticket.status)}>
                  {ticket.status}
                </td>
                <td>
                  <button
                    className={styles.adminViewBtn}
                    onClick={() =>
                      navigate(`/helpdesk/admin/ticket/${ticket._id}`)
                    }
                  >
                    View Ticket
                  </button>
                  <button
                    className={styles.adminDeleteBtn}
                    onClick={() => handleAssignAgent(ticket._id)}
                  >
                    Assign Agent
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

export default AdminTickets;
