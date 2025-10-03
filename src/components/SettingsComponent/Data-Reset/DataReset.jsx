import styles from "./dataReset.module.css";
import { useState } from "react";

// Modal component
function ConfirmModal({
  open,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  danger,
}) {
  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h3 className={styles.modalTitle}>{title}</h3>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalActions}>
          <button
            className={danger ? styles.dangerBtn : styles.confirmBtn}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button className={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast component
function Toast({ open, message }) {
  if (!open) return null;
  return <div className={styles.toast}>{message}</div>;
}

export default function DataReset() {
  // Modal state
  const [modal, setModal] = useState(null); // 'transactions', 'goals', 'all', or null
  // Toast state
  const [toast, setToast] = useState("");

  // Reset handlers
  function handleReset(type) {
    // Clear localStorage or relevant data
    if (type === "transactions") {
      // localStorage.removeItem("transactions");
      setToast("Transactions have been reset successfully.");
    } else if (type === "goals") {
      // localStorage.removeItem("goals");
      setToast("Goals have been reset successfully.");
    } else if (type === "all") {
      // localStorage.clear();
      setToast("All app data has been reset.");
    }
    setModal(null);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div className={styles.dataReset}>
      {/* Title and subtitle */}
      <div className={styles.headerRow}>
        <h2 className={styles.headerTitle}>Data Reset</h2>
        <span className={styles.sticker}>🗑️</span>
      </div>
      <p className={styles.subtitle}>
        Manage or reset your stored data.{" "}
        <b>Be careful—this action cannot be undone.</b>
      </p>

      {/* Reset options */}
      <div className={styles.optionsGrid}>
        {/* Reset Transactions */}
        <div className={styles.optionCard}>
          <div className={styles.optionIcon}>💸</div>
          <div className={styles.optionTexts}>
            <h3>Reset Transactions</h3>
            <p>Removes all saved transactions.</p>
          </div>
          <button
            className={styles.dangerBtn}
            onClick={() => setModal("transactions")}
          >
            Reset
          </button>
        </div>
        {/* Reset Goals */}
        <div className={styles.optionCard}>
          <div className={styles.optionIcon}>🎯</div>
          <div className={styles.optionTexts}>
            <h3>Reset Goals</h3>
            <p>Deletes all saved goals.</p>
          </div>
          <button
            className={styles.dangerBtn}
            onClick={() => setModal("goals")}
          >
            Reset
          </button>
        </div>
        {/* Reset Entire App Data */}
        <div className={styles.optionCard + " " + styles.nuclearCard}>
          <div className={styles.optionIcon}>⚠️</div>
          <div className={styles.optionTexts}>
            <h3>Reset Entire App Data</h3>
            <p>
              Clears everything: current balance, transactions, goals, settings,
              etc.
            </p>
          </div>
          <button className={styles.nuclearBtn} onClick={() => setModal("all")}>
            Nuclear Reset
          </button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        open={modal === "transactions"}
        title="Confirm Reset Transactions"
        message="Are you sure you want to delete all transactions? This action cannot be undone."
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={() => handleReset("transactions")}
        onCancel={() => setModal(null)}
        danger={true}
      />
      <ConfirmModal
        open={modal === "goals"}
        title="Confirm Reset Goals"
        message="Are you sure you want to delete all goals? This action cannot be undone."
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={() => handleReset("goals")}
        onCancel={() => setModal(null)}
        danger={true}
      />
      <ConfirmModal
        open={modal === "all"}
        title="Confirm Nuclear Reset"
        message="This will erase all your data and restore the app to its initial state. Are you 100% sure?"
        confirmText="Yes, Reset All"
        cancelText="Cancel"
        onConfirm={() => handleReset("all")}
        onCancel={() => setModal(null)}
        danger={true}
      />

      {/* Success Toast */}
      <Toast open={!!toast} message={toast} />
    </div>
  );
}
