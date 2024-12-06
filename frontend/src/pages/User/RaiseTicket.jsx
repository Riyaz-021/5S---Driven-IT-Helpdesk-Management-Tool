import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./RaiseTicket.module.css";
import UserSidebar from "./UserSidebar.jsx";

function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/helpdesk/user/raise_ticket",
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
      <UserSidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Raise Ticket</h1>
        <center>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <h3>Fill Out Your Issue</h3>
              <label htmlFor="title" className={styles.label}>
                Title:
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
                placeholder="Enter ticket title"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
                placeholder="Describe the issue"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="priority" className={styles.label}>
                Priority:
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={styles.select}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <button type="submit" className={styles.submitBtn}>
              Submit
            </button>
          </form>
        </center>
      </div>
    </div>
  );
}

export default CreateTicket;
