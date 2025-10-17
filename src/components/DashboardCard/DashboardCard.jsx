import CountUp from "react-countup";
import styles from "./dashboardCard.module.css";
import { useEffect, useState, useRef } from "react";

// --- DashboardCard with manual balance update modal and tooltip ---
export default function DashboardCard() {
  // Savings Goal
  const saved = 1200;
  const target = 3000;
  const [progress, setProgress] = useState(0);

  // Current balance state (editable)
  const [currentBalance, setCurrentBalance] = useState(2562);
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  // Tooltip state
  const [showTooltip, setShowTooltip] = useState(false);

  // Animate progress bar
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress((saved / target) * 100);
    }, 300);
    return () => clearTimeout(timeout);
  }, [saved, target]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  // Focus input when modal opens
  useEffect(() => {
    if (showModal && inputRef.current) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
    }
  }, [showModal]);

  // Handle modal open
  function openModal() {
    setInputValue("");
    setShowModal(true);
  }
  // Handle modal close
  function closeModal() {
    setShowModal(false);
  }
  // Handle balance update (add to current balance)
  function handleUpdateBalance(e) {
    e.preventDefault();
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value > 0) {
      setCurrentBalance((prev) => prev + value);
      setInputValue("");
      setShowModal(false);
    }
  }

  return (
    <>
      {/* DashboardCard uses glass effect and accent color for box-shadow in dark mode */}
      <div
        className={styles.dashboardCard}
        style={{ overflow: "visible", position: "relative" }}
      >
        {/* Current Balance */}
        {/* Current Balance card uses accent color for heading and box-shadow in dark mode */}
        <div className={styles.card}>
          <div>
            {/* Heading uses accent color (green) in dark mode */}
            <h3>Current Balance</h3>
            {/* Amount uses accent gradient in dark mode */}
            <p className={styles.amount}>
              ${" "}
              <CountUp
                start={0}
                end={currentBalance}
                duration={1.2}
                separator=","
              />
            </p>
          </div>
          {/* Button uses accent gradient and box-shadow in dark mode */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              className={styles.syncButton}
              onClick={openModal}
              style={{ position: "relative" }}
              aria-label="Add or update balance"
            >
              + Add
            </button>
            {/* Tooltip trigger */}
            <span
              style={{
                marginLeft: 4,
                cursor: "pointer",
                fontSize: "1.2rem",
                position: "relative",
                display: "inline-block",
                zIndex: 20,
              }}
              onMouseEnter={(e) => {
                setShowTooltip(true);
                // Save mouse position for tooltip
                const rect = e.currentTarget.getBoundingClientRect();
                window.dashboardTooltipPos = {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                };
              }}
              onMouseLeave={() => setShowTooltip(false)}
              tabIndex={0}
              aria-label="Info about manual balance update"
            >
              {/* White question mark in white circle SVG */}
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle
                  cx="11"
                  cy="11"
                  r="10"
                  fill="#fff"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  x="7"
                  y="16"
                  fontSize="12"
                  fill="#232946"
                  fontWeight="bold"
                >
                  ?
                </text>
              </svg>
              {showTooltip && (
                <span
                  style={{
                    position: "absolute",
                    right: "1px",
                    top: "18px",
                    background: "rgba(24,24,36,0.97)",
                    color: "#fff",
                    padding: "0.7rem 1.1rem",
                    borderRadius: 10,
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    boxShadow: "0 4px 16px #23294688",
                    zIndex: 9999,
                    width: 210,
                    whiteSpace: "pre-line",
                    border: "1px solid #fff",
                  }}
                  role="tooltip"
                >
                  Add to your current balance manually to match your real
                  financial account. Use this if your app balance is out of sync
                  with your actual funds.
                </span>
              )}
            </span>
          </div>
        </div>
        {/* Modal for manual balance update */}
        {showModal && (
          <div
            className={styles.modalOverlay}
            style={{ zIndex: 1000 }}
            onClick={closeModal}
          >
            <div
              className={styles.modalContent}
              style={{
                minWidth: 320,
                maxWidth: 360,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeModalBtn}
                onClick={closeModal}
                aria-label="Close"
                style={{ right: 18, top: 18 }}
              >
                &times;
              </button>
              <h2
                style={{
                  color: "var(--accent)",
                  marginBottom: 12,
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  textAlign: "center",
                }}
              >
                Add to Balance
              </h2>
              <form
                onSubmit={handleUpdateBalance}
                className={styles.goalForm}
                style={{ width: "100%" }}
              >
                <label htmlFor="balanceInput">Enter amount to add</label>
                <input
                  id="balanceInput"
                  ref={inputRef}
                  type="number"
                  min="0"
                  step="0.01"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g. 3000"
                  style={{ marginBottom: 16 }}
                  required
                />
                <p
                  style={{ color: "#b8b8b8", fontSize: "0.9rem", marginTop: 6 }}
                >
                  Adding to your balance is permanent. To change totals later,
                  use Settings.
                </p>
                <div
                  className={styles.modalBtns}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    marginTop: 12,
                  }}
                >
                  <button
                    type="submit"
                    className={styles.modalButtons}
                    style={{
                      flex: 1,
                      background: "var(--accent-gradient)",
                      color: "#fff",
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className={styles.modalButtons}
                    style={{ flex: 1, color: "#fff", background: "#ef4444" }}
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Divider */}
        <hr />
        {/* Income, Expenses & Goals */}
        {/* Info cards for Income, Expenses, and Goals use colored backgrounds and accent color for box-shadow in dark mode */}
        <div className={styles.row}>
          <span className={styles.rowTop}>
            {/* Income card uses green gradient, text white, heading accent green in dark mode */}
            <div className={`${styles.infoCard} ${styles.incomeCard}`}>
              <h4>Total Income</h4>
              <p>
                $ <CountUp start={0} end={5000} duration={2} separator="," />
              </p>
            </div>
            {/* Expense card uses orange/red gradient, text white, heading accent green in dark mode */}
            <div className={`${styles.infoCard} ${styles.expenseCard}`}>
              <h4>Total Expenses</h4>
              <p>
                $ <CountUp start={0} end={2438} duration={2} separator="," />
              </p>
            </div>
          </span>

          {/* Goal card uses blue gradient, text white, heading accent green in dark mode */}
          <div
            className={`${styles.infoCard} ${styles.goalCard} ${styles.rowDown}`}
          >
            <span>
              <h4>Active Saving Goal</h4>
              <p>
                $ {saved.toLocaleString()} of $ {target.toLocaleString()}
              </p>

              {/* Progress bar uses accent gradient and accent color for box-shadow in dark mode */}
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
