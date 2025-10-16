import { FiDelete } from "react-icons/fi";
import styles from "./goalForm.module.css";
import { useState, useRef, useEffect } from "react";

// Default goal icons
const defaultGoalIcons = [
  "💻",
  "🏖️",
  "🚗",
  "🏠",
  "🎓",
  "📱",
  "🎮",
  "🛍️",
  "🎸",
  "📚",
  "🧳",
  "🚴",
  "🧘",
  "🎂",
  "🖼️",
];

// Example goal data structure
const initialGoals = [
  {
    id: 1,
    name: "Buy a new laptop",
    target: 1200,
    saved: 400,
    icon: "💻",
    deadline: "2025-12-31",
    completed: false,
  },
  {
    id: 2,
    name: "Vacation",
    target: 2000,
    saved: 800,
    icon: "🏖️",
    deadline: "2026-06-01",
    completed: false,
  },
];

export default function GoalForm() {
  // State for goals
  const [goals, setGoals] = useState(initialGoals);
  // Modal state
  const [showModal, setShowModal] = useState(false);
  // New goal form state
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");
  const [goalIcon, setGoalIcon] = useState(defaultGoalIcons[0]);
  const [iconOptions, setIconOptions] = useState(defaultGoalIcons);
  const [emojiInputRef, setEmojiInputRef] = useState(null);
  // Savings modal state
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [savingsAmount, setSavingsAmount] = useState("");
  const [activeGoalId, setActiveGoalId] = useState(null);

  // Goal completed popup
  const [showCompletedPopup, setShowCompletedPopup] = useState(false);
  const [completedGoal, setCompletedGoal] = useState(null);
  // Info popup for incomplete savings
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  // Add new goal
  function handleAddGoal(e) {
    e.preventDefault();
    if (!goalName || !goalTarget || !goalDeadline) return;
    const newGoal = {
      id: Date.now(),
      name: goalName,
      target: Number(goalTarget),
      saved: 0,
      icon: goalIcon,
      deadline: goalDeadline,
      completed: false,
    };
    setGoals([...goals, newGoal]);
    setShowModal(false);
    setGoalName("");
    setGoalTarget("");
    setGoalDeadline("");
    setGoalIcon(iconOptions[0]);
  }

  // Mark goal as completed (only if savings reached target)
  function handleCompleteGoal(id) {
    const goal = goals.find((g) => g.id === id);
    if (goal.saved < goal.target) {
      setInfoMessage(
        "You must complete your savings goal before marking as completed."
      );
      setShowInfoPopup(true);
      return;
    }
    setCompletedGoal(goal);
    setShowCompletedPopup(true);
    setGoals(goals.map((g) => (g.id === id ? { ...g, completed: true } : g)));
  }

  // Reset completed goal
  function handleResetGoal(id) {
    setGoals(
      goals.map((g) => (g.id === id ? { ...g, completed: false, saved: 0 } : g))
    );
    setShowCompletedPopup(false);
    setCompletedGoal(null);
  }
  // Delete goal
  function handleDeleteGoal(id) {
    setGoals(goals.filter((g) => g.id !== id));
  }

  // Add to savings (cannot exceed target)
  function handleAddToSavings(e) {
    e.preventDefault();
    if (!savingsAmount || isNaN(savingsAmount) || Number(savingsAmount) <= 0)
      return;
    const goal = goals.find((g) => g.id === activeGoalId);
    const maxAdd = goal.target - goal.saved;
    if (Number(savingsAmount) > maxAdd) {
      setInfoMessage(`You cannot add more than $${maxAdd} to this goal.`);
      setShowInfoPopup(true);
      return;
    }
    setGoals(
      goals.map((g) =>
        g.id === activeGoalId
          ? {
              ...g,
              saved: g.saved + Number(savingsAmount),
              completed:
                g.saved + Number(savingsAmount) >= g.target
                  ? true
                  : g.completed,
            }
          : g
      )
    );
    // If goal is completed after adding
    if (goal && goal.saved + Number(savingsAmount) >= goal.target) {
      setCompletedGoal({ ...goal, saved: goal.target });
      setShowCompletedPopup(true);
    }
    setShowSavingsModal(false);
    setSavingsAmount("");
    setActiveGoalId(null);
  }
  // Focus emoji input when + is clicked
  function handlePlusClick() {
    if (emojiInputRef) emojiInputRef.focus();
  }

  // Progress bar calculation
  function getProgress(goal) {
    return Math.min(100, Math.round((goal.saved / goal.target) * 100));
  }

  // Format deadline date as 'Month Day, Year'
  function formatDeadline(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Prevent background scroll when any modal is open
  useEffect(() => {
    if (showModal || showSavingsModal || showCompletedPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal, showSavingsModal, showCompletedPopup]);

  return (
    <div className={styles.goalContainer}>
      {/* Header and Add Goal Button */}
      <div className={styles.headerRow}>
        <h2 className={styles.header}>Goals</h2>
        <button
          className={styles.addGoalBtn}
          onClick={() => setShowModal(true)}
        >
          + Add Goal
        </button>
      </div>

      {/* Goal Cards (no grid, stacked below) */}
      <div className={styles.goalList}>
        {goals.length === 0 && (
          <div className={styles.emptyMsg}>
            No goals yet. Start by adding one!
          </div>
        )}
        {goals.map((goal) => (
          <div key={goal.id} className={styles.goalCard}>
            <div className={styles.goalHeader}>
              <span className={styles.goalIcon}>{goal.icon}</span>
              <span className={styles.goalName}>{goal.name}</span>
              {goal.completed && (
                <span className={styles.completed}>✔️ Completed</span>
              )}
              <button
                className={styles.deleteGoalBtn}
                title="Delete Goal"
                onClick={() => handleDeleteGoal(goal.id)}
              >
                <FiDelete />
              </button>
            </div>
            <div className={styles.goalDetails}>
              <span className={styles.goalTarget}>Target: ${goal.target}</span>
              <span className={styles.goalSaved}>Saved: ${goal.saved}</span>
              <span className={styles.goalDeadline}>
                Deadline: {formatDeadline(goal.deadline)}
              </span>
            </div>
            <div className={styles.progressBarWrapper}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{ width: `${getProgress(goal)}%` }}
                ></div>
              </div>
              <span className={styles.progressText}>{getProgress(goal)}%</span>
            </div>
            {!goal.completed && (
              <div className={styles.goalActions}>
                <button
                  className={styles.savingsBtn}
                  onClick={() => {
                    setShowSavingsModal(true);
                    setActiveGoalId(goal.id);
                  }}
                >
                  Add to Savings
                </button>
                <button
                  className={styles.completeBtn}
                  onClick={() => handleCompleteGoal(goal.id)}
                >
                  Mark as Completed
                </button>
              </div>
            )}
            {goal.completed && (
              <button
                className={styles.resetBtn}
                onClick={() => handleResetGoal(goal.id)}
              >
                Reset Goal
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Goal Modal with icon grid */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeModalBtn}
              onClick={() => setShowModal(false)}
              title="Close"
            >
              ✖
            </button>
            <h3>Add New Goal</h3>
            <div className={styles.iconGrid}>
              {iconOptions.map((icon, idx) => (
                <span
                  key={icon + idx}
                  className={
                    icon === goalIcon ? styles.iconSelected : styles.iconOption
                  }
                  onClick={() => setGoalIcon(icon)}
                  style={{ cursor: "pointer", fontSize: "1.5rem" }}
                >
                  {icon}
                </span>
              ))}
              <span
                className={styles.iconOption}
                style={{
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  position: "relative",
                }}
                onClick={handlePlusClick}
                title="On Windows: Win + . or Win + ; | On Mac: Cmd + Ctrl + Space"
              >
                +
                <input
                  ref={(ref) => setEmojiInputRef(ref)}
                  type="text"
                  maxLength={2}
                  style={{ position: "absolute", left: "-9999px" }}
                  onChange={(e) => setGoalIcon(e.target.value)}
                  placeholder="Emoji"
                />
              </span>
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: "#b8b8b8",
                marginBottom: "0.5rem",
              }}
            >
              Tip: On Windows, use <b>Win + .</b> or <b>Win + ;</b> to open the
              emoji picker. On Mac, use <b>Cmd + Ctrl + Space</b>.
            </div>
            <form onSubmit={handleAddGoal} className={styles.goalForm}>
              <label>
                Name:
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                />
              </label>
              <label>
                Target Amount:
                <input
                  type="number"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  required
                  min={1}
                />
              </label>
              <label>
                Deadline:
                <input
                  type="date"
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  required
                />
              </label>
              <div className={styles.modalBtns}>
                <button type="submit" className={styles.modalButtons}>
                  Save
                </button>
                <button
                  type="button"
                  className={styles.modalButtons}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add to Savings Modal */}
      {showSavingsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeModalBtn}
              onClick={() => setShowSavingsModal(false)}
              title="Close"
            >
              ✖
            </button>
            <h3>Add to Savings</h3>
            <form onSubmit={handleAddToSavings} className={styles.goalForm}>
              <label>
                Amount:
                <input
                  type="number"
                  value={savingsAmount}
                  onChange={(e) => setSavingsAmount(e.target.value)}
                  required
                  min={1}
                />
              </label>
              <div className={styles.modalBtns}>
                <button type="submit" className={styles.modalButtons}>
                  Add
                </button>
                <button
                  type="button"
                  className={styles.modalButtons}
                  onClick={() => setShowSavingsModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Completed Popup */}
      {showCompletedPopup && completedGoal && (
        <div className={styles.modalOverlay}>
          <div className={styles.completedModalContent}>
            <button
              className={styles.closeModalBtn}
              onClick={() => {
                setShowCompletedPopup(false);
                setCompletedGoal(null);
              }}
              title="Close"
            >
              ✖
            </button>
            <div className={styles.completedBadge}>🏅</div>
            <h3>Goal Completed!</h3>
            <div className={styles.completedGoalName}>
              {completedGoal.icon} {completedGoal.name}
            </div>
            <div className={styles.completedGoalAmount}>
              Target: ${completedGoal.target}
            </div>
            <button
              className={styles.resetBtn}
              onClick={() => handleResetGoal(completedGoal.id)}
            >
              Reset Goal
            </button>
          </div>
        </div>
      )}

      {/* Info Popup for restrictions and messages */}
      {showInfoPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.completedModalContent}>
            <button
              className={styles.closeModalBtn}
              onClick={() => setShowInfoPopup(false)}
              title="Close"
            >
              ✖
            </button>
            <h3>Notice</h3>
            <div style={{ margin: "1rem 0", fontWeight: "bold" }}>
              {infoMessage}
            </div>
            <button
              className={styles.modalButtons}
              onClick={() => setShowInfoPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* Future premium: custom icon upload, goal reminders, etc. */}
    </div>
  );
}
