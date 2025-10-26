import CountUp from "react-countup";
import { useMemo, useState } from "react";
import TransactionRecords from "../../components/TransactionRecords/TransactionRecords";
import styles from "./reports.module.css";
import { useAppContext } from "../../context/AppContext";

import IncomeExpensesChart from "../../components/Chart/IncomeExpensesChart/IncomeExpensesChart";
import ExpensesBreakdownChart from "../../components/Chart/ExpensesBreakdownChart/ExpensesBreakdownChart";
import BalanceTrendChart from "../../components/Chart/BalanceTrendChart/BalanceTrendChart";
import TimeframeSelector from "../../components/TimeframeSelector/TimeframeSelector";

/*
 * Reports page (UI-only)
 * - Overview cards with animated counts
 * - Charts grid (each chart is a separate component)
 */
export default function Reports({ isSidebarCollapsed }) {
  // --- Attractive Reports Page ---
  const [filter, setFilter] = useState("Day");

  const {
    transactions = [],
    totals = { totalIncome: 0, totalExpenses: 0 },
    currentBalance = 0,
    goalsSummary = {},
  } = useAppContext();

  const totalIncome = totals.totalIncome || 0;
  const totalExpenses = totals.totalExpenses || 0;
  const netSavings = totalIncome - totalExpenses;

  // Build buckets depending on the selected filter (Day / Week / Month)
  const incomeExpensesData = useMemo(() => {
    const now = new Date();

    if (filter === "Day") {
      // Current week: Monday -> Sunday
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      // getDay: 0 (Sun) .. 6 (Sat). We'll consider Monday as first day.
      const diffToMon = (day + 6) % 7; // how many days since Monday
      startOfWeek.setDate(now.getDate() - diffToMon);
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        const iso = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("en-US", { weekday: "short" });
        const income = (transactions || [])
          .filter((t) => t.date === iso && t.type === "income")
          .reduce((s, x) => s + Number(x.amount || 0), 0);
        const expenses = (transactions || [])
          .filter((t) => t.date === iso && t.type === "expense")
          .reduce((s, x) => s + Number(x.amount || 0), 0);
        days.push({ month: label, income, expenses });
      }
      return days;
    }

    if (filter === "Week") {
      // Calendar weeks (Monday -> Sunday) covering the current month
      const year = now.getFullYear();
      const monthIndex = now.getMonth();
      const firstOfMonth = new Date(year, monthIndex, 1);
      const lastOfMonth = new Date(year, monthIndex + 1, 0);

      // find the Monday on or before the 1st of the month
      const startWeek = new Date(firstOfMonth);
      const day = startWeek.getDay();
      const diffToMon = (day + 6) % 7; // days since Monday
      startWeek.setDate(firstOfMonth.getDate() - diffToMon);

      const out = [];
      let cursor = new Date(startWeek);
      let weekIndex = 0;
      while (cursor <= lastOfMonth) {
        const weekStart = new Date(cursor);
        const weekEnd = new Date(cursor);
        weekEnd.setDate(weekStart.getDate() + 6);

        const startIso = weekStart.toISOString().split("T")[0];
        const endIso = weekEnd.toISOString().split("T")[0];

        const income = (transactions || [])
          .filter(
            (t) => t.date >= startIso && t.date <= endIso && t.type === "income"
          )
          .reduce((s, x) => s + Number(x.amount || 0), 0);
        const expenses = (transactions || [])
          .filter(
            (t) =>
              t.date >= startIso && t.date <= endIso && t.type === "expense"
          )
          .reduce((s, x) => s + Number(x.amount || 0), 0);

        const label = `Week of ${weekStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`;
        out.push({ month: label, income, expenses });

        weekIndex++;
        cursor.setDate(cursor.getDate() + 7);
      }
      return out;
    }

    // Default: Month (last 6 months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        monthLabel: d.toLocaleString("en-US", { month: "short" }),
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
      });
    }
    return months.map((m) => {
      const monthStr = `${m.year}-${String(m.monthIndex + 1).padStart(2, "0")}`;
      const income = (transactions || [])
        .filter(
          (t) => t.date && t.date.startsWith(monthStr) && t.type === "income"
        )
        .reduce((s, x) => s + Number(x.amount || 0), 0);
      const expenses = (transactions || [])
        .filter(
          (t) => t.date && t.date.startsWith(monthStr) && t.type === "expense"
        )
        .reduce((s, x) => s + Number(x.amount || 0), 0);
      return { month: `${m.monthLabel} ${m.year}`, income, expenses };
    });
  }, [filter, transactions]);

  // Balance trend: cumulative monthly balance (net per month)
  const balanceTrendData = useMemo(() => {
    let cumulative = 0;
    return incomeExpensesData.map((row) => {
      cumulative += (row.income || 0) - (row.expenses || 0);
      return { period: row.month, balance: cumulative };
    });
  }, [incomeExpensesData]);

  // Expenses breakdown by category
  const expensesBreakdown = useMemo(() => {
    const map = {};
    (transactions || [])
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const key = (t.category && t.category.name) || t.note || "Other";
        map[key] = (map[key] || 0) + Number(t.amount || 0);
      });
    return Object.keys(map).map((k) => ({ name: k, value: map[k] }));
  }, [transactions]);

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
        {/* Reusable timeframe selector (Day / Week / Month) */}
        <div>
          {/* TimeframeSelector component */}
          <TimeframeSelector value={filter} onChange={setFilter} />
        </div>
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
            <span className={styles.cardTitle}>Current Balance</span>
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
            data={incomeExpensesData}
            barSize={36}
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
          <ExpensesBreakdownChart
            data={expensesBreakdown}
            colors={["#A068E4", "#8B54D4", "#FF4D94", "#4FD1C5", "#FFD166"]}
          />
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
        <BalanceTrendChart data={balanceTrendData} accentColor="#22c55e" />
      </div>
      {/* Transaction Records UI (UI-only for now) */}
      <div style={{ marginTop: "1rem" }}>
        <TransactionRecords />
      </div>
    </div>
  );
}
