import CountUp from "react-countup";
import styles from "./dashboardCard.module.css";
import { useEffect, useState } from "react";

export default function DashboardCard() {
  // Savings Goal
  const saved = 1200;
  const target = 3000;
  const [progress, setProgress] = useState(0);
  //this will animate the progress bar
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress((saved / target) * 100);
    }, 300); //This will delay b4 the animation starts

    return () => clearTimeout(timeout);
  }, [saved, target]);

  return (
    <>
      {/* DashboardCard uses glass effect and accent color for box-shadow in dark mode */}
      <div className={styles.dashboardCard}>
        {/* Current Balance */}
        {/* Current Balance card uses accent color for heading and box-shadow in dark mode */}
        <div className={styles.card}>
          <div>
            {/* Heading uses accent color (green) in dark mode */}
            <h3>Current Balance</h3>
            {/* Amount uses accent gradient in dark mode */}
            <p className={styles.amount}>
              $ <CountUp start={0} end={2562} duration={2} separator="," />
            </p>
          </div>
          {/* Button uses accent gradient and box-shadow in dark mode */}
          <button className={styles.syncButton}>+ Add</button>{" "}
        </div>
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
