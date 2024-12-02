import React from "react";
import styles from "./StatusProgress.module.css";

function StatusProgress({ status }) {
  const getStatusIndex = () => {
    switch (status) {
      case "Open":
        return 1;
      case "Assigned":
        return 2;
      case "In Progress":
        return 3;
      case "Resolved":
        return 4;
      case "Closed":
        return 5;
      default:
        return 1;
    }
  };

  const statusIndex = getStatusIndex();

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${(statusIndex / 5) * 100}%` }}
        ></div>
      </div>
      <div className={styles.checkpoints}>
        <div
          className={`${styles.checkpoint} ${
            statusIndex >= 1 ? styles.active : ""
          }`}
        >
          Open
        </div>
        <div
          className={`${styles.checkpoint} ${
            statusIndex >= 2 ? styles.active : ""
          }`}
        >
          Assigned
        </div>
        <div
          className={`${styles.checkpoint} ${
            statusIndex >= 3 ? styles.active : ""
          }`}
        >
          In Progress
        </div>
        <div
          className={`${styles.checkpoint} ${
            statusIndex >= 4 ? styles.active : ""
          }`}
        >
          Resolved
        </div>
        <div
          className={`${styles.checkpoint} ${
            statusIndex >= 5 ? styles.active : ""
          }`}
        >
          Closed
        </div>
      </div>
    </div>
  );
}

export default StatusProgress;
