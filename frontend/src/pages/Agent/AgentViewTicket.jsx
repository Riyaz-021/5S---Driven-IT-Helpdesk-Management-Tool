import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AgentSidebar from "./AgentSidebar";
import StatusProgress from "../StatusProgress";
import styles from "./AgentViewTicket.module.css";

const AgentViewTicket = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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

  const handleReject = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/helpdesk/agent_tickets/${ticketId}/reject`,
        {},
        { withCredentials: true }
      );
      alert("Ticket has been rejected.");
      setTicket((prevTicket) => ({ ...prevTicket, assignedTo: null }));
      navigate("/helpdesk/agent_tickets");
    } catch (err) {
      console.error(
        "Error rejecting ticket:",
        err.response?.data || err.message
      );
      alert("Failed to reject the ticket.");
    }
  };

  const handleResolve = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/helpdesk/agent_tickets/${ticketId}/resolve`,
        {},
        { withCredentials: true }
      );
      alert("Ticket has been resolved.");
      setTicket((prevTicket) => ({ ...prevTicket, status: "Resolved" }));
    } catch (err) {
      console.error(
        "Error resolving ticket:",
        err.response?.data || err.message
      );
      alert("Failed to resolve the ticket.");
    }
  };

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <AgentSidebar className={styles.sidebar} />
        <div className={styles.mainContent}>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className={styles.pageContainer}>
        <AgentSidebar className={styles.sidebar} />
        <div className={styles.mainContent}>
          <div className={styles.loading}>Loading ticket details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <AgentSidebar className={styles.sidebar} />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.title}>Ticket Details</h1>
          <div className={styles.ticketDetails}>
            <p>
              <span className={styles.label}>Ticket ID:</span> {ticket._id}
            </p>
            <p>
              <span className={styles.label}>Title:</span> {ticket.title}
            </p>
            <p>
              <span className={styles.label}>Description:</span>{" "}
              {ticket.description}
            </p>
            <p>
              <span className={styles.label}>Priority:</span>{" "}
              <span
                className={
                  ticket.priority === "High"
                    ? styles.priorityHigh
                    : ticket.priority === "Medium"
                    ? styles.priorityMedium
                    : styles.priorityLow
                }
              >
                {ticket.priority}
              </span>
            </p>
            <p>
              <span className={styles.label}>Status:</span>{" "}
              <span
                className={
                  ticket.status === "Open"
                    ? styles.statusopen
                    : ticket.status === "Assigned"
                    ? styles.statusassigned
                    : ticket.status === "In Progress"
                    ? styles.statusinprogress
                    : ticket.status === "Resolved"
                    ? styles.statusresolved
                    : styles.statusclosed
                }
              >
                {ticket.status}
              </span>
            </p>
            <p>
              <span className={styles.label}>Raised By:</span>{" "}
              {ticket.userId?.username || "N/A"}
            </p>
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.rejectButton} onClick={handleReject}>
              Reject
            </button>
            <button className={styles.resolveButton} onClick={handleResolve}>
              Resolve
            </button>
          </div>
          <StatusProgress status={ticket.status} />
        </div>
      </div>
    </div>
  );
};

export default AgentViewTicket;
