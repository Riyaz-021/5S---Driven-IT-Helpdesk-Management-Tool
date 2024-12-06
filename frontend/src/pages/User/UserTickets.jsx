import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "./UserSidebar.jsx";
import SearchBar from "../SearchBar.jsx";
import axios from "axios";
import styles from "./UserTickets.module.css";

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState({ column: "", direction: "asc" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/helpdesk/user_tickets",
          { withCredentials: true }
        );
        setTickets(response.data);
        setFilteredTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
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

  const handleSort = (column) => {
    const direction =
      sortOrder.column === column && sortOrder.direction === "asc"
        ? "desc"
        : "asc";
    const sortedTickets = [...filteredTickets].sort((a, b) => {
      const order = direction === "asc" ? 1 : -1;
      if (column === "priority") {
        const priorities = { High: 3, Medium: 2, Low: 1 };
        return (priorities[a.priority] - priorities[b.priority]) * order;
      }
      if (column === "status") {
        const statuses = {
          Open: 1,
          Assigned: 2,
          InProgress: 3,
          Resolved: 4,
          Closed: 5,
        };
        return (statuses[a.status] - statuses[b.status]) * order;
      }
      return 0;
    });
    setFilteredTickets(sortedTickets);
    setSortOrder({ column, direction });
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/helpdesk/tickets/${ticketId}`);
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await axios.delete(
          `http://localhost:3000/helpdesk/user_tickets/${ticketId}`,
          {
            withCredentials: true,
          }
        );
        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket._id !== ticketId)
        );
        setFilteredTickets((prevFilteredTickets) =>
          prevFilteredTickets.filter((ticket) => ticket._id !== ticketId)
        );
      } catch (error) {
        console.error("Error deleting ticket:", error);
      }
    }
  };

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

  return (
    <div className={styles.userTicketsPage}>
      <UserSidebar />
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>My Tickets</h1>
        <div className={styles.pageHeader}>
          <div className={styles.controls}>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search by Title or ID"
            />
          </div>
          <button
            onClick={() => navigate("/helpdesk/raise_tickets")}
            className={styles.raiseTicketButton}
          >
            Raise Ticket
          </button>
        </div>
        <table className={styles.ticketsTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th
                onClick={() => handleSort("priority")}
                style={{
                  cursor: "pointer",
                  color: "#ffe492",
                }}
              >
                Priority
                {sortOrder.column === "priority" &&
                  (sortOrder.direction === "asc" ? " ▲" : " ▼")}
              </th>
              <th
                onClick={() => handleSort("status")}
                style={{
                  cursor: "pointer",
                  color: "#ffe492",
                }}
              >
                Status
                {sortOrder.column === "status" &&
                  (sortOrder.direction === "asc" ? " ▲" : " ▼")}
              </th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket._id}</td>
                <td>
                  <strong>{ticket.title}</strong>
                </td>
                <td className={getPriorityClass(ticket.priority)}>
                  <strong>{ticket.priority}</strong>
                </td>
                <td className={getStatusClass(ticket.status)}>
                  <strong>{ticket.status}</strong>
                </td>
                <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className={styles.viewButton}
                    onClick={() => handleViewTicket(ticket._id)}
                  >
                    View
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteTicket(ticket._id)}
                  >
                    Delete
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

export default UserTickets;
