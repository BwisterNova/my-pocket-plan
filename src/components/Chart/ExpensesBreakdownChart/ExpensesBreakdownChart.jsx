import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./expensesBreakdownChart.module.css";

/**
 * Pie chart with multiple harmonious colors.
 */
export default function ExpensesBreakdownChart() {
  const data = [
    { name: "Food", value: 800 },
    { name: "Transport", value: 400 },
    { name: "Bills", value: 1200 },
    { name: "Shopping", value: 600 },
    { name: "Misc", value: 200 },
  ];
  const COLORS = ["#A068E4", "#8B54D4", "#FF4D94", "#4FD1C5", "#FFD166"];

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={48}
            outerRadius={88}
            paddingAngle={4}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            wrapperStyle={{ background: "#1F1136", border: "none" }}
            contentStyle={{ color: "#fff" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
