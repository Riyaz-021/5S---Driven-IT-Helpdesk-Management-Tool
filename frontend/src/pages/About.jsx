import React from "react";
import styles from "./About.module.css";
import Navbar from "./Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <div className={styles.aboutContainer}>
        <h1 className={styles.heading}>About IT HelpDesk</h1>
        <p className={styles.description}>
          Welcome to IT HelpDesk, your trusted partner in efficient and reliable
          IT support solutions. Our platform is designed to bridge the gap
          between users, agents, and administrators by delivering a streamlined,
          user-friendly experience for managing and resolving IT issues
          effectively.
        </p>
        <section className={styles.section}>
          <h2 className={styles.subHeading}>Who We Are ?</h2>
          <p className={styles.text}>
            At IT HelpDesk, we believe in the power of collaboration and
            innovation to solve everyday technical challenges. Our team of
            skilled developers and support specialists is dedicated to providing
            a comprehensive solution that caters to:
            <br />
            <ul>
              <li>
                <strong> Users:</strong> Offering an intuitive interface to
                raise tickets and track progress.
                <br />
              </li>
              <li>
                <strong> Agents:</strong> Empowering technical staff with tools
                to manage and resolve issues efficiently.
                <br />
              </li>
              <li>
                <strong> Admins:</strong> Providing insights, control, and
                customizability to ensure smooth operations.
              </li>
            </ul>
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subHeading}>Our Mission</h2>
          <p className={styles.text}>
            Our mission is to simplify IT support for businesses and
            individuals.
            <br />
            <strong>We aim to:</strong>
            <br />
            <ul>
              <li>
                <strong>Enhance Productivity:</strong> By minimizing downtime
                with quick resolutions.
              </li>
              <li>
                <strong>Improve Communication:</strong> By fostering clear and
                transparent interaction among users, agents, and admins.
              </li>
              <li>
                <strong>Deliver Excellence:</strong> By continuously refining
                our platform to meet evolving IT demands.
              </li>
            </ul>
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subHeading}>What We Offer</h2>
          <ul className={styles.featureList}>
            <li>
              <strong>Real-Time Ticket Management:</strong> Raise, assign, and
              resolve tickets with ease.
            </li>
            <li>
              <strong>Advanced Prioritization:</strong> Manage tasks effectively
              with customizable priority settings.
            </li>
            <li>
              <strong>Insightful Dashboards:</strong> Access comprehensive
              reports and visual analytics for better decision-making.
            </li>
            <li>
              <strong>Secure User Management:</strong> Protect user data with
              robust authentication mechanisms.
            </li>
            <li>
              <strong>Customizable Features:</strong> Adapt the platform to meet
              unique organizational needs.
            </li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subHeading}>Why Choose Us?</h2>
          <ul className={styles.featureList}>
            <li>
              <strong>User-Centric Design: </strong> Raise, assign, and resolve
              tickets with ease.
            </li>
            <li>
              <strong>Scalable Solutions:</strong> Our platform is designed to
              grow with your needs, whether you're a small team or a large
              organization.
            </li>
            <li>
              <strong>Dedicated Support:</strong> Our team is committed to
              providing you with exceptional service every step of the way.
            </li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subHeading}>Contact Us</h2>
          <p className={styles.text}>
            Have questions or need assistance? Reach out to our support team at{" "}
            <a
              href="mailto:support@ithelpdesk.com"
              className={styles.emailLink}
            >
              support@ithelpdesk.com
            </a>{" "}
            or visit the{" "}
            <a href="/helpdesk/contact">
              {" "}
              <strong>Contact</strong>{" "}
            </a>{" "}
            page for more details.
          </p>
        </section>
      </div>
    </>
  );
};

export default About;
