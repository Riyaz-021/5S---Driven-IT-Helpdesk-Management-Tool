import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AgentSidebar from "./AgentSidebar";
import styles from "./AgentViewTicket.module.css";

const ViewTicket = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/helpdesk/agent_tickets/${ticketId}`,
          { withCredentials: true }
        );
        setTicket(response.data);
      } catch (err) {
        console.error(
          "Error fetching ticket details:",
          err.response?.data || err.message
        );
        setError("Failed to load ticket details");
      }
    };
    fetchTicketDetails();
  }, [ticketId]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
      </div>
    );
  }

  if (!ticket) {
    return <div className={styles.loading}>Loading ticket details...</div>;
  }

  return (
    <div className={styles.agentDashboard}>
      <AgentSidebar />
      <div className={styles.agentContent}>
        <h1 className={styles.pageTitle}>Ticket Details</h1>
        <div className={styles.ticketDetails}>
          <p>
            <strong>Ticket ID:</strong> {ticket._id}
          </p>
          <p>
            <strong>Title:</strong> {ticket.title}
          </p>
          <p>
            <strong>Description:</strong> {ticket.description}
          </p>
          <p>
            <strong>Status:</strong> {ticket.status}
          </p>
          <p>
            <strong>Priority:</strong> {ticket.priority}
          </p>
          <p>
            <strong>Created By:</strong> {ticket.userId?.username || "N/A"}
          </p>
          <p>
            <strong>Assigned To:</strong>{" "}
            {ticket.assignedTo?.username || "Unassigned"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;
