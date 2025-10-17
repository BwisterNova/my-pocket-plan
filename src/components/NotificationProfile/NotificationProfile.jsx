import styles from "./notificationProfile.module.css";
import { FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function NotificationProfile({ className = "" }) {
  const navigate = useNavigate();

  return (
    <div className={`${styles.notificationProfile} ${className}`}>
      <button
        className={styles.iconBtn}
        aria-label="Notifications"
        onClick={() => navigate("/notifications")}
      >
        <FiBell />
        <span className={styles.badge} aria-hidden>
          3
        </span>
      </button>

      <Link
        to="/settings/profile"
        className={styles.iconBtn}
        aria-label="Profile"
      >
        <FaUserCircle />
      </Link>
    </div>
  );
}
