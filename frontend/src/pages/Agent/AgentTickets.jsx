import React, { useEffect, useState } from "react";
import axios from "axios";
import AgentSidebar from "./AgentSidebar";
import styles from "./AgentTickets.module.css";

const AgentTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/helpdesk/agent_tickets",
          {
            withCredentials: true,
          }
        );
        setTickets(response.data);
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

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
      </div>
    );
  }

  const handleTakeUp = async (ticketId) => {
    try {
      await axios.patch(
        `http://localhost:3000/helpdesk/agent_tickets/${ticketId}/take-up`,
        {
          withCredentials: true,
        }
      );
      alert("You have taken up the ticket!");
      const response = await axios.get(
        "http://localhost:3000/helpdesk/agent_tickets",
        {
          withCredentials: true,
        }
      );
      setTickets(response.data);
    } catch (err) {
      console.error(
        "Error taking up ticket:",
        err.response?.data || err.message
      );
      alert("Failed to take up the ticket.");
    }
  };

  return (
    <div className={styles.agentDashboard}>
      <AgentSidebar />
      <div className={styles.agentContent}>
        <h1 className={styles.pageTitle}>My Tickets</h1>
        <div className={styles.ticketsContainer}>
          <table className={styles.ticketsTable}>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket._id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td
                    className={`${styles.status} ${
                      styles[ticket.status.toLowerCase().replace(" ", "")]
                    }`}
                  >
                    {ticket.status}
                  </td>
                  <td
                    className={`${styles.priority} ${
                      styles[ticket.priority.toLowerCase()]
                    }`}
                  >
                    {ticket.priority}
                  </td>
                  <td>
                    <button
                      onClick={() => handleView(ticket._id)}
                      className={styles.viewButton}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleTakeUp(ticket._id)}
                      className={styles.takeUpButton}
                    >
                      Take Up
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentTickets;
