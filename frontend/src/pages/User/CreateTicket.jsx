import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./CreateTicket.module.css";
import DashboardNav from "./DashboardNav";

function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/helpdesk/tickets/create",
        { title, description, priority },
        { withCredentials: true }
      );
      alert("Ticket raised successfully!");
      navigate("/helpdesk/user_dashboard");
    } catch (error) {
      console.error("Error raising ticket:", error);
    }
  };

  return (
    <div className={styles.container}>
      <DashboardNav />
      <h2>Raise a New Ticket</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateTicket;
