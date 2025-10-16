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
  // --- Attractive Reports Page ---
  const [filter, setFilter] = useState("This Month");
  // Dummy summary numbers (replace with real context data later)
  const totalIncome = 5000;
  const totalExpenses = 3200;
  const netSavings = totalIncome - totalExpenses;
  const currentBalance = 7000;

  return (
    <div
      className={`${styles.page} ${
        isSidebarCollapsed ? styles.collapsedMargin : styles.expandedMargin
      }`}
      style={{
        background: "linear-gradient(135deg, #181824 60%, #232946 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Header with filter */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>
          <span
            style={{
              background: "var(--accent-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
            }}
          >
            Reports
          </span>{" "}
          <span role="img" aria-label="chart">
            📊
          </span>
        </h1>
      </div>

      {/* Overview cards - glass effect, accent shadow */}
      <div className={styles.overview} role="region" aria-label="Overview">
        <div
          className={`${styles.card} ${styles.incomeCard} fadeInUp`}
          style={{ boxShadow: "0 4px 24px #22c55e44" }}
        >
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
          style={{ animationDelay: "0.08s", boxShadow: "0 4px 24px #ef444444" }}
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
          style={{ animationDelay: "0.16s", boxShadow: "0 4px 24px #22c55e44" }}
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

      {/* Charts grid - glass, accent, responsive */}
      <div className={styles.chartsGrid}>
        <div
          className={`${styles.largeChartBox} fadeInUp`}
          style={{
            animationDelay: "0.2s",
            background: "rgba(34,197,94,0.08)",
            boxShadow: "0 2px 16px #22c55e33",
          }}
        >
          <div className={styles.boxHeader}>
            <h3 style={{ color: "var(--accent)" }}>Income vs Expenses</h3>
          </div>
          {/* --- IncomeExpensesChart: bars wider, new colors --- */}
          <IncomeExpensesChart
            barSize={32}
            incomeColor="#22c55e"
            expenseColor="#ef4444"
          />
        </div>

        <div
          className={`${styles.smallChartBox} fadeInUp`}
          style={{
            animationDelay: "0.28s",
            background: "rgba(34,197,94,0.06)",
            boxShadow: "0 2px 12px #22c55e22",
          }}
        >
          <div className={styles.boxHeader}>
            <h3 style={{ color: "var(--accent)" }}>Expenses Breakdown</h3>
          </div>
          {/* --- ExpensesBreakdownChart: improved colors --- */}
          <ExpensesBreakdownChart accentColor="#22c55e" />
        </div>
      </div>
      <div
        className={`${styles.largeChartBox} fadeInUp ${styles.BalanceTrendChartBox}`}
        style={{
          animationDelay: "0.36s",
          marginTop: "2rem",
          background: "rgba(34,197,94,0.08)",
          boxShadow: "0 2px 16px #22c55e33",
        }}
      >
        <div className={styles.boxHeader}>
          <h3 style={{ color: "var(--accent)" }}>Balance Trend </h3>
          <h1 style={{ color: "var(--accent)" }}>
            ${currentBalance.toLocaleString()}
          </h1>
          <p style={{ color: "var(--text-muted)" }}>Current Balance</p>
        </div>
        {/* --- BalanceTrendChart: improved responsiveness --- */}
        <BalanceTrendChart accentColor="#22c55e" />
      </div>
    </div>
  );
}
