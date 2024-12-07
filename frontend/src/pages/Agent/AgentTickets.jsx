import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AgentSidebar from "./AgentSidebar";
import SearchBar from "../SearchBar";
import styles from "./AgentTickets.module.css";

const AgentTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);

  const navigate = useNavigate();

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
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search by Title or ID"
          />
          <table className={styles.ticketsTable}>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket._id}</td>
                  <td>{ticket.title}</td>
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
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() =>
                          navigate(`/helpdesk/agent_tickets/${ticket._id}`)
                        }
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
                    </div>
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
