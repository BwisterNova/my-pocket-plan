import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";
import styles from "./incomeExpensesChart.module.css";

/**
 * Income vs Expenses (bar chart) - dummy data
 * Includes gradient fills for a premium look.
 */
export default function IncomeExpensesChart({
  data: dataProp,
  barSize = 30,
  incomeColor = "#22c55e",
  expenseColor = "#ef4444",
}) {
  const defaultData = [
    { month: "Jan", income: 2500, expenses: 1400 },
    { month: "Feb", income: 4000, expenses: 2000 },
    { month: "Mar", income: 3200, expenses: 2100 },
    { month: "Apr", income: 3800, expenses: 900 },
    { month: "May", income: 4800, expenses: 2600 },
  ];

  const chartData = dataProp && dataProp.length ? dataProp : defaultData;

  // create subtle gradients using the provided colors
  const incomeGrad = incomeColor;
  const expensesGrad = expenseColor;
  const [hover, setHover] = useState(null); // { series, index }

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 18, left: -8, bottom: 6 }}
        >
          {/* gradients and glow filters */}
          <defs>
            <linearGradient id="gradIncome" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={incomeGrad} stopOpacity={1} />
              <stop offset="100%" stopColor={incomeGrad} stopOpacity={0.85} />
            </linearGradient>
            <linearGradient id="gradExpenses" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={expensesGrad} stopOpacity={1} />
              <stop offset="100%" stopColor={expensesGrad} stopOpacity={0.85} />
            </linearGradient>
            <filter
              id="glowIncome"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="glowExpenses"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#B8B8B8" }} axisLine={false} />
          <YAxis
            tickFormatter={(v) =>
              `$${new Intl.NumberFormat().format(Number(v || 0))}`
            }
            tick={{ fill: "#B8B8B8" }}
            axisLine={false}
          />
          <Tooltip
            wrapperStyle={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 6px 30px rgba(0,0,0,0.6)",
              borderRadius: 10,
              backdropFilter: "blur(6px)",
            }}
            contentStyle={{ color: "#fff" }}
            formatter={(value) => [
              `$${new Intl.NumberFormat().format(Number(value || 0))}`,
              "Amount",
            ]}
          />
          <Legend
            formatter={(v) => <span style={{ color: "#B8B8B8" }}>{v}</span>}
          />
          <Bar
            dataKey="income"
            fill="url(#gradIncome)"
            radius={[0, 0, 0, 0]}
            barSize={barSize}
          >
            {chartData.map((entry, idx) => (
              <Cell
                key={`inc-${idx}`}
                onMouseEnter={() => setHover({ series: "income", index: idx })}
                onMouseLeave={() => setHover(null)}
                fill="url(#gradIncome)"
                stroke={
                  hover && hover.series === "income" && hover.index === idx
                    ? "rgba(255,255,255,0.12)"
                    : undefined
                }
                strokeWidth={
                  hover && hover.series === "income" && hover.index === idx
                    ? 2
                    : 0
                }
                filter={
                  hover && hover.series === "income" && hover.index === idx
                    ? "url(#glowIncome)"
                    : undefined
                }
              />
            ))}
          </Bar>

          <Bar
            dataKey="expenses"
            fill="url(#gradExpenses)"
            radius={[0, 0, 0, 0]}
            barSize={barSize}
          >
            {chartData.map((entry, idx) => (
              <Cell
                key={`exp-${idx}`}
                onMouseEnter={() =>
                  setHover({ series: "expenses", index: idx })
                }
                onMouseLeave={() => setHover(null)}
                fill="url(#gradExpenses)"
                stroke={
                  hover && hover.series === "expenses" && hover.index === idx
                    ? "rgba(255,255,255,0.12)"
                    : undefined
                }
                strokeWidth={
                  hover && hover.series === "expenses" && hover.index === idx
                    ? 2
                    : 0
                }
                filter={
                  hover && hover.series === "expenses" && hover.index === idx
                    ? "url(#glowExpenses)"
                    : undefined
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
