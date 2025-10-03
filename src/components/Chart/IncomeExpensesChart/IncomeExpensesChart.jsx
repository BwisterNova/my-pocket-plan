import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import styles from "./incomeExpensesChart.module.css";

/**
 * Income vs Expenses (bar chart) - dummy data
 * Includes gradient fills for a premium look.
 */
export default function IncomeExpensesChart() {
  const data = [
    { month: "Jan", income: 2500, expenses: 1400 },
    { month: "Feb", income: 4000, expenses: 2000 },
    { month: "Mar", income: 3200, expenses: 2100 },
    { month: "Apr", income: 3800, expenses: 900 },
    { month: "May", income: 4800, expenses: 2600 },
  ];

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 18, left: -8, bottom: 6 }}
        >
          {/* gradients */}
          <defs>
            <linearGradient id="gradIncome" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#A068E4" stopOpacity={1} />
              <stop offset="100%" stopColor="#8B54D4" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="gradExpenses" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4FD1C5" stopOpacity={1} />
              <stop offset="100%" stopColor="#2FB6A8" stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#B8B8B8" }} axisLine={false} />
          <YAxis
            tickFormatter={(v) => `$${v / 1000}k`}
            tick={{ fill: "#B8B8B8" }}
            axisLine={false}
          />
          <Tooltip
            wrapperStyle={{
              background: "#1F1136",
              border: "none",
              boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
            }}
            contentStyle={{ color: "#000" }}
          />
          <Legend
            formatter={(v) => <span style={{ color: "#B8B8B8" }}>{v}</span>}
          />
          <Bar
            dataKey="income"
            fill="url(#gradIncome)"
            radius={[8, 8, 0, 0]}
            barSize={18}
          />
          <Bar
            dataKey="expenses"
            fill="url(#gradExpenses)"
            radius={[8, 8, 0, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
