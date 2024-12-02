import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AssignAgent.module.css";
import AdminSidebar from "./AdminSidebar";

const AssignAgent = () => {
  const { id } = useParams(); // Ticket ID from URL
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/helpdesk/admin/agents",
          { withCredentials: true }
        );
        setAgents(response.data);
      } catch (err) {
        setError("Failed to load agents.");
        console.error(err);
      }
    };

    fetchAgents();
  }, []);

  const handleAssign = async (agentId) => {
    try {
      await axios.patch(
        `http://localhost:3000/helpdesk/admin/tickets/${id}/assign`,
        { agentId },
        { withCredentials: true }
      );
      navigate("/helpdesk/admin_tickets");
    } catch (err) {
      setError("Failed to assign the ticket.");
      console.error(err);
    }
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <div className={styles.content}>
        <h1>Assign Ticket</h1>
        {error && <p className={styles.error}>{error}</p>}
        <table className={styles.agentTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent._id}>
                <td>{agent._id}</td>
                <td>{agent.username}</td>
                <td>{agent.capacity}/10</td>
                <td>
                  <button
                    onClick={() => handleAssign(agent._id)}
                    className={styles.assignButton}
                  >
                    Assign
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

export default AssignAgent;
