import styles from "./profileSettings.module.css";
import { FaGoogle } from "react-icons/fa";

export default function ProfileSettings() {
  return (
    <div className={styles.profileSettings}>
      {/* ==== Section: Your Profile ==== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Profile</h2>
        <div className={styles.profileCard}>
          {/* Avatar placeholder */}
          <div className={styles.avatar}>
            <span>👤</span>
          </div>

          {/* User info */}
          <div className={styles.userInfo}>
            <p className={styles.name}>John Doe</p>
            <p className={styles.email}>
              johndoe@gmail.com <FaGoogle className={styles.googleIcon} />
            </p>
          </div>

          {/* Edit button placeholder */}
          <button className={styles.editBtn}>Edit</button>
        </div>
      </section>

      {/* ==== Section: Security ==== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Security</h2>
        <div className={styles.listItem}>
          <p>Change Password</p>
          <button className={styles.disabledBtn} disabled>
            Disabled for Google sign-in
          </button>
        </div>
      </section>

      {/* ==== Section: Account Management ==== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Account Management</h2>
        <div className={styles.actions}>
          <button className={styles.logoutBtn}>Log Out</button>
          <button className={styles.deleteBtn}>Delete Account</button>
        </div>
      </section>
    </div>
  );
}
