import CountUp from "react-countup";
import { useState } from "react";
import styles from "./reports.module.css";

import IncomeExpensesChart from "../../components/Chart/IncomeExpensesChart/IncomeExpensesChart";
import ExpensesBreakdownChart from "../../components/Chart/ExpensesBreakdownChart/ExpensesBreakdownChart";
import BalanceTrendChart from "../../components/Chart/BalanceTrendChart/BalanceTrendChart";

/*
 * Reports page (UI-only)
 * - Overview cards with animated counts
 * - Charts grid (each chart is a separate component)
 */
export default function Reports({ isSidebarCollapsed }) {
  const [filter, setFilter] = useState("This Month");

  // Dummy summary numbers (replace with real context data later)
  const totalIncome = 5000;
  const totalExpenses = 3200;
  const netSavings = totalIncome - totalExpenses;

  return (
    <div
      className={`${styles.page} ${
        isSidebarCollapsed ? styles.collapsedMargin : styles.expandedMargin
      }`}
    >
      {/* Header */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Reports 📊</h1>
        <select
          className={styles.filter}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Overview cards */}
      <div className={styles.overview} role="region" aria-label="Overview">
        <div className={`${styles.card} ${styles.incomeCard} fadeInUp`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>💰</span>
            <span className={styles.cardTitle}>Total Income</span>
          </div>
          <div className={styles.cardValue}>
            <CountUp
              start={0}
              end={totalIncome}
              duration={1.6}
              separator=","
              prefix="$"
            />
          </div>
        </div>

        <div
          className={`${styles.card} ${styles.expenseCard} fadeInUp`}
          style={{ animationDelay: "0.08s" }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>💸</span>
            <span className={styles.cardTitle}>Total Expenses</span>
          </div>
          <div className={styles.cardValue}>
            <CountUp
              start={0}
              end={totalExpenses}
              duration={1.6}
              separator=","
              prefix="$"
            />
          </div>
        </div>

        <div
          className={`${styles.card} ${styles.savingsCard} fadeInUp`}
          style={{ animationDelay: "0.16s" }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>📈</span>
            <span className={styles.cardTitle}>Net Savings</span>
          </div>
          <div className={styles.cardValue}>
            <CountUp
              start={0}
              end={netSavings}
              duration={1.6}
              separator=","
              prefix="$"
            />
          </div>
        </div>
      </div>

      {/* Charts grid */}
      <div className={styles.chartsGrid}>
        <div
          className={`${styles.largeChartBox} fadeInUp`}
          style={{ animationDelay: "0.2s" }}
        >
          <div className={styles.boxHeader}>
            <h3>Income vs Expenses</h3>
          </div>
          <IncomeExpensesChart />
        </div>

        <div
          className={`${styles.smallChartBox} fadeInUp`}
          style={{ animationDelay: "0.28s" }}
        >
          <div className={styles.boxHeader}>
            <h3>Expenses Breakdown</h3>
          </div>
          <ExpensesBreakdownChart />
        </div>
      </div>
      <div
        className={`${styles.largeChartBox} fadeInUp ${styles.BalanceTrendChartBox}`}
        style={{ animationDelay: "0.36s", marginTop: "2rem" }}
      >
        <div className={styles.boxHeader}>
          <h3>Balance Trend </h3>
          <h1>$7,000</h1>
          <p>Current Balance</p>
        </div>
        <BalanceTrendChart />
      </div>
    </div>
  );
}
