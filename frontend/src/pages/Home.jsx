import Navbar from "./Navbar.jsx";
import Coverpic from "../assets/coverpic.jpg";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

function Homepage() {
  return (
    <div>
      <Navbar />
      <main className={styles.mainSection}>
        <div className={styles.contentBox}>
          <h1>
            Get the Help You Need,
            <br />
            When You Need It—
            <br />
            Welcome to IT-HelpDesk
            <br />
            <br />
            <center>
              <Link to="/helpdesk/login">
                <button className={styles.signInBtn}>Login</button>
              </Link>
            </center>
          </h1>
          <img src={Coverpic} alt="Cover" className={styles.coverImage} />
        </div>
      </main>
    </div>
  );
}

export default Homepage;
