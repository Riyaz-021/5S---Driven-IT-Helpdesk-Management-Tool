import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>IT - HelpDesk</div>
      <div className={styles.links}>
        <Link to="/" className={styles.link}>
          Home
        </Link>
        <Link to="/about" className={styles.link}>
          About
        </Link>
        <Link to="/contact" className={styles.link}>
          Contact
        </Link>
        <Link to="/helpdesk/login" className={styles.link}>
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
