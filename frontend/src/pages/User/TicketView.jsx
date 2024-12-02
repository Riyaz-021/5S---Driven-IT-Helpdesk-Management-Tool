import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./TicketView.module.css";
import DashboardNav from "./DashboardNav";
import StatusProgress from "../StatusProgress";

function TicketView() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = () => {
    axios
      .get(`http://localhost:3000/helpdesk/tickets/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setTicket(response.data.ticket);
      })
      .catch((error) => {
        setError("Error fetching ticket details.");
        console.error("Error fetching ticket details:", error);
      });
  };

  const handleCloseTicket = async () => {
    setIsClosing(true);
    try {
      await axios.patch(
        `http://localhost:3000/helpdesk/tickets/${id}`,
        { status: "Closed" },
        { withCredentials: true }
      );
      setTicket((prevTicket) => ({ ...prevTicket, status: "Closed" }));
      setIsClosing(false);
    } catch (error) {
      setError("Failed to close the ticket.");
      console.error("Failed to close the ticket:", error);
      setIsClosing(false);
    }
  };

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!ticket) {
    return <p>Loading ticket details...</p>;
  }

  const priorityClass =
    ticket.priority === "High"
      ? styles.priorityHigh
      : ticket.priority === "Medium"
      ? styles.priorityMedium
      : styles.priorityLow;

  const statusClass =
    ticket.status === "Open"
      ? styles.statusOpen
      : ticket.status === "In Progress"
      ? styles.statusInProgress
      : styles.statusClosed;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebar}>
        <DashboardNav />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h2 className={styles.title}>Ticket Details</h2>
          <div className={styles.ticketDetails}>
            <p>
              <span className={styles.label}>Title:</span> {ticket.title}
            </p>
            <p>
              <span className={styles.label}>Description:</span>{" "}
              {ticket.description}
            </p>
            <p>
              <span className={styles.label}>Priority:</span>{" "}
              <span className={priorityClass}>{ticket.priority}</span>
            </p>
            <p>
              <span className={styles.label}>Status:</span>{" "}
              <span className={statusClass}>{ticket.status}</span>
            </p>
            <p>
              <span className={styles.label}>Created By:</span>{" "}
              {ticket.createdBy}
            </p>
            <p>
              <span className={styles.label}>Created At:</span>{" "}
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
          <StatusProgress status={ticket.status} />
          <button
            onClick={handleCloseTicket}
            className={styles.closeTicketBtn}
            disabled={ticket.status === "Closed" || isClosing}
          >
            {isClosing ? "Closing..." : "Close Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketView;
