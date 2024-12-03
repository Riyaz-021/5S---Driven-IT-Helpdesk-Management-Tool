import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./DashboardNav.module.css";
import axios from "axios";

function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [activeTab, setActiveTab] = useState(location.pathname); // Initialize with current path

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/helpdesk/logout", {
        withCredentials: true,
      });

      // Redirect to login page and clear session cache
      window.location.href = "/helpdesk/login"; // Redirect
      window.location.reload(); // Clear cached pages
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    // Update activeTab whenever the path changes
    setActiveTab(location.pathname);
  }, [location]);

  const handleTabClick = (path) => {
    setActiveTab(path); // Set the clicked tab as active
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.brand}>IT - HelpDesk</div>
      <br />
      <br />
      <br />
      <div className={styles.links}>
        <Link
          to="/helpdesk/user_dashboard"
          onClick={() => handleTabClick("/helpdesk/user_dashboard")}
          className={`${styles.link} ${
            activeTab === "/helpdesk/user_dashboard" ? styles.active : ""
          }`}
        >
          <i className="fas fa-home"></i> Home
        </Link>
        <br />
        <Link
          to="/about"
          onClick={() => handleTabClick("/about")}
          className={`${styles.link} ${
            activeTab === "/about" ? styles.active : ""
          }`}
        >
          <i className="fas fa-info-circle"></i> About
        </Link>
        <br />
        <Link
          to="/contact"
          onClick={() => handleTabClick("/contact")}
          className={`${styles.link} ${
            activeTab === "/contact" ? styles.active : ""
          }`}
        >
          <i className="fas fa-envelope"></i> Contact
        </Link>
        <br />
        <button onClick={handleLogout} className={styles.signOutBtn}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardSidebar;
