import styles from "./dataReset.module.css";
import { useState } from "react";
import { useAppContext } from "../../../context/AppContext";

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
  // App context for transactions and reset helpers
  const { transactions, editTransaction, removeTransaction, resetData } =
    useAppContext();
  const manualTopups = (transactions || []).filter((t) => t.manual === true);

  // Reset handlers
  function handleReset(type) {
    // Clear relevant data via AppContext
    if (type === "transactions") {
      resetData("transactions");
      setToast("Transactions have been reset successfully.");
    } else if (type === "goals") {
      resetData("goals");
      setToast("Goals have been reset successfully.");
    } else if (type === "all") {
      resetData("all");
      setToast("All app data has been reset.");
    }
    setModal(null);
    setTimeout(() => setToast(""), 3000);
  }

  function handleEditManual(id, newAmount) {
    const res = editTransaction(id, { amount: Number(newAmount) });
    if (res.success) {
      setToast("Manual top-up updated.");
      setTimeout(() => setToast(""), 3000);
    } else {
      setToast("Failed to update.");
      setTimeout(() => setToast(""), 3000);
    }
  }

  function handleDeleteManual(id) {
    const res = removeTransaction(id);
    if (res.success) {
      setToast("Manual top-up removed.");
      setTimeout(() => setToast(""), 3000);
    }
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

      {/* Manual top-ups editor */}
      <div style={{ marginTop: 20 }}>
        <h3>Manual top-ups</h3>
        <p style={{ color: "#666", marginBottom: 12 }}>
          These are amounts you added manually using the dashboard +Add. Edit or
          remove them here — changing them will update your current balance
          accordingly.
        </p>
        {manualTopups.length === 0 && (
          <div className={styles.emptyMsg}>No manual top-ups found.</div>
        )}
        {manualTopups.map((tx) => (
          <div key={tx.id} className={styles.manualRow}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ fontSize: 20 }}>{tx.category.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>
                  {tx.note || "Manual top-up"}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>{tx.date}</div>
              </div>
              <input
                type="number"
                defaultValue={tx.amount}
                min={0}
                onBlur={(e) => handleEditManual(tx.id, e.target.value)}
                style={{ width: 120, padding: "6px 8px" }}
              />
              <button
                className={styles.dangerBtn}
                onClick={() => handleDeleteManual(tx.id)}
                style={{ marginLeft: 8 }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
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
