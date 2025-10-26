import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./expensesBreakdownChart.module.css";

/**
 * Pie chart with multiple harmonious colors.
 */
export default function ExpensesBreakdownChart({ data: dataProp, colors }) {
  const defaultData = [
    { name: "Food", value: 800 },
    { name: "Transport", value: 400 },
    { name: "Bills", value: 1200 },
    { name: "Shopping", value: 600 },
    { name: "Misc", value: 200 },
  ];
  const defaultColors = ["#A068E4", "#8B54D4", "#FF4D94", "#4FD1C5", "#FFD166"];

  const chartData = dataProp && dataProp.length ? dataProp : defaultData;
  const COLORS = colors && colors.length ? colors : defaultColors;

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            innerRadius={48}
            outerRadius={88}
            paddingAngle={4}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            wrapperStyle={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              backdropFilter: "blur(6px)",
            }}
            contentStyle={{ color: "#fff" }}
            formatter={(value, name) => [
              `$${new Intl.NumberFormat().format(Number(value || 0))}`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
