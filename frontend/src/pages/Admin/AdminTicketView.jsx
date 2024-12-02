import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar.jsx";
import StatusProgress from "../StatusProgress.jsx";
import styles from "./AdminTicketView.module.css";

const TicketView = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/helpdesk/admin/ticket/${id}`
        );
        setTicket(response.data);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Failed to load ticket details.");
      }
    };

    fetchTicket();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!ticket) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.pageContainer}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.title}>Ticket Details</h1>
        <div className={styles.ticketDetails}>
          <p>
            <strong>Ticket ID:</strong> {ticket._id}
          </p>
          <p>
            <strong>Title:</strong> {ticket.title}
          </p>
          <p>
            <strong>Priority:</strong> {ticket.priority}
          </p>
          <p>
            <strong>Status:</strong> {ticket.status}
          </p>
          <p>
            <strong>Description:</strong> {ticket.description}
          </p>
        </div>
        <StatusProgress status={ticket.status} />
      </div>
    </div>
  );
};

export default TicketView;
