import { Link, useNavigate } from "react-router-dom";
import styles from "./DashboardNav.module.css";
import axios from "axios";

function DashboardSidebar() {
  const navigate = useNavigate();

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

  return (
    <div className={styles.sidebar}>
      <div className={styles.brand}>IT - HelpDesk</div>
      <br />
      <br />
      <br />
      <div className={styles.links}>
        <Link to="/" className={styles.link}>
          <i className="fas fa-home"></i> Home
        </Link>
        <br />
        <Link to="/about" className={styles.link}>
          <i className="fas fa-info-circle"></i> About
        </Link>
        <br />
        <Link to="/contact" className={styles.link}>
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
