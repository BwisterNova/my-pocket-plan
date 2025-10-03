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
    <div>
      <div className={styles.dashboardCard}>
        {/* Current Balance */}
        <div className={styles.card}>
          <div>
            <h3>Current Balance</h3>
            <p className={styles.amount}>
              $ <CountUp start={0} end={2562} duration={2} separator="," />
            </p>
          </div>
          <button className={styles.syncButton}>Sync to Cloud</button>{" "}
        </div>
        <hr />
        {/* Income, Expenses & Goals */}
        <div className={styles.row}>
          <span className={styles.rowTop}>
            <div className={styles.infoCard}>
              <h4>Total Income</h4>
              <p>
                $ <CountUp start={0} end={5000} duration={2} separator="," />
              </p>
            </div>
            <div className={styles.infoCard}>
              <h4>Total Expenses</h4>
              <p>
                $ <CountUp start={0} end={2438} duration={2} separator="," />
              </p>
            </div>
          </span>

          <div className={styles.infoCard}>
            <span className={styles.rowDown}>
              <h4>Active Saving Goal</h4>
              <p>
                $ {saved.toLocaleString()} of $ {target.toLocaleString()}
              </p>

              {/* Progress bar inside the info card */}
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
    </div>
  );
}
