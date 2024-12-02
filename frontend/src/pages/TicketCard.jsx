import React from "react";
import styles from "./TicketCard.module.css";

function TicketCard({
  ticket,
  getPriorityStyle,
  getStatusStyle,
  onView,
  onDelete,
}) {
  return (
    <div className={styles.ticketCard}>
      <div className={styles.ticketHeader}>
        <h4 className={styles.ticketTitle}>
          #{ticket.index + 1} - {ticket.title}
        </h4>
      </div>
      <div className={styles.ticketMeta}>
        Priority:
        <span
          className={`${styles.priority} ${getPriorityStyle(ticket.priority)}`}
        >
          <b>{ticket.priority}</b>
        </span>
        Status:
        <span className={`${styles.status} ${getStatusStyle(ticket.status)}`}>
          <b>{ticket.status}</b>
        </span>
      </div>
      <div className={styles.ticketDetails}>
        <p>
          {ticket.createdBy} {new Date(ticket.createdAt).toLocaleDateString()}{" "}
          at {new Date(ticket.createdAt).toLocaleTimeString()}
        </p>
      </div>
      <div className={styles.buttonGroup}>
        <button onClick={() => onView(ticket._id)} className={styles.viewBtn}>
          View
        </button>
        <button
          onClick={() => onDelete(ticket._id)}
          className={styles.deleteBtn}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TicketCard;
