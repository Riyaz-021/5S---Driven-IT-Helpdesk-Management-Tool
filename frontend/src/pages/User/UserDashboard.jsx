import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./UserDashboard.module.css";
import DashboardNav from "./DashboardNav";
import TicketCard from "../TicketCard";

function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("highToLow");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/helpdesk/user_dashboard", {
        withCredentials: true,
      })
      .then((response) => {
        setTickets(response.data.tickets || []);
      })
      .catch((error) => {
        setError("Error fetching tickets.");
        console.error("Error fetching tickets:", error);
      });
  }, []);

  const getPriorityValue = (priority) => {
    switch (priority) {
      case "High":
        return 3;
      case "Medium":
        return 2;
      case "Low":
        return 1;
      default:
        return 0;
    }
  };

  const handleSort = () => {
    const sortedTickets = [...tickets].sort((a, b) => {
      const priorityA = getPriorityValue(a.priority);
      const priorityB = getPriorityValue(b.priority);

      return sortOrder === "highToLow"
        ? priorityB - priorityA
        : priorityA - priorityB;
    });

    setTickets(sortedTickets);
    setSortOrder(sortOrder === "highToLow" ? "lowToHigh" : "highToLow");
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return styles.highPriority;
      case "Medium":
        return styles.mediumPriority;
      case "Low":
        return styles.lowPriority;
      default:
        return "";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "In Progress":
        return styles.inProgress;
      case "Open":
        return styles.open;
      case "Closed":
        return styles.closed;
      default:
        return "";
    }
  };

  const handleRaiseTicket = () => {
    navigate("/helpdesk/tickets/create");
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/helpdesk/tickets/${ticketId}`);
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:3000/helpdesk/tickets/${ticketId}`, {
        withCredentials: true,
      });
      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
      console.log("Ticket deleted successfully");
    } catch (error) {
      console.error("Failed to delete ticket", error);
      setError("Failed to delete the ticket.");
    }
  };

  return (
    <div className={styles.container}>
      <DashboardNav />
      <main className={styles.mainSection}>
        <h1>User Dashboard</h1>
        <div className={styles.headerContainer}>
          <div className={styles.leftSection}>
            <h3>All Tickets:</h3>
            <button onClick={handleSort} className={styles.sortBtn}>
              Sort <i className="fa-solid fa-retweet"></i>
            </button>
          </div>
          <button onClick={handleRaiseTicket} className={styles.raiseTicketBtn}>
            Raise Ticket
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.ticketsContainer}>
          {tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <TicketCard
                key={ticket._id}
                ticket={{ ...ticket, index }}
                getPriorityStyle={getPriorityStyle}
                getStatusStyle={getStatusStyle}
                onView={handleViewTicket}
                onDelete={handleDeleteTicket}
              />
            ))
          ) : (
            <p>No tickets found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
