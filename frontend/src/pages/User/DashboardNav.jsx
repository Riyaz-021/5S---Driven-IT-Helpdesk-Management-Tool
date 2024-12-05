import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { fetchUserProfile } from "../../utils/helper.js";
import styles from "./DashboardNav.module.css";

const DashboardSidebar = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    getUserData();
  }, []);

  //Track location of tab
  useEffect(() => {
    // Update activeTab whenever the path changes
    setActiveTab(location.pathname);
  }, [location]);

  const handleTabClick = (path) => {
    setActiveTab(path); // Update the activeTab state
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/helpdesk/logout", {
        withCredentials: true,
      });
      navigate("/helpdesk/login");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.brand}>IT - HelpDesk</div>
      {/* User Profile Section */}
      <div className={styles.profileSection}>
        <div className={styles.avatar}>
          {user?.username?.[0]?.toUpperCase() || "U"}
        </div>
        <div className={styles.profileDetails}>
          <span className={styles.profileName}>{user?.username || "User"}</span>
          <br />
          <span className={styles.profileRole}>{user?.role || "User"}</span>
        </div>
      </div>

      <div className={styles.links}>
        <Link
          to="/helpdesk/user_dashboard"
          onClick={() => handleTabClick("/helpdesk/user_dashboard")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/user_dashboard" ? styles.active : ""
          }`}
        >
          <i className="fas fa-home"></i> Dashboard
        </Link>
        <Link
          to="/helpdesk/user_tickets"
          onClick={() => handleTabClick("/helpdesk/user_tickets")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/user_tickets" ? styles.active : ""
          }`}
        >
          <i className="fas fa-ticket-alt"></i> My Tickets
        </Link>
        <Link
          to="/helpdesk/user_settings"
          onClick={() => handleTabClick("/helpdesk/user_settings")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/user_settings" ? styles.active : ""
          }`}
        >
          <i className="fas fa-cog"></i> Settings
        </Link>
        <button onClick={handleLogout} className={styles.signOutBtn}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
