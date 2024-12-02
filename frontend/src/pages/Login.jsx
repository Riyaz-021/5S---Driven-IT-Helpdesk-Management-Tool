import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Dashboard from "../assets/Dashboard.png";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const home = () => {
    navigate("/helpdesk");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/helpdesk/login",
        formData,
        { withCredentials: true } // Include credentials like cookies
      );

      if (response.status === 200) {
        const { role } = response.data;

        // Redirect based on user role
        if (role === "User") {
          navigate("/helpdesk/user_dashboard");
        } else if (role === "Admin") {
          navigate("/helpdesk/admin_dashboard");
        } else {
          setError("Unknown role. Please contact support.");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.leftSectionContent}>
          <h1>Having trouble with work?</h1>
          <p>
            Raise your ticket and get it solved by experts ready to help you!
          </p>
        </div>
        <div className={styles.imageWrapper}>
          <img src={Dashboard} alt="Dashboard" className={styles.image} />
        </div>
      </div>

      <div className={styles.rightSection}>
        <form id="login-form" onSubmit={handleSubmit}>
          <h4>Login</h4>

          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Michael Jackson"
            className={styles.input}
            required
            value={formData.username}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="off"
            className={styles.input}
            required
            value={formData.password}
            onChange={handleChange}
          />

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
          <p className={styles.back} onClick={home}>
            Back to home
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
