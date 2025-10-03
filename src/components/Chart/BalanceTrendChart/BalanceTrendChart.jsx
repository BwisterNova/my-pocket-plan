import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";
import styles from "./balanceTrendChart.module.css";

/**
 * Balance trend line (plots current balance through time).
 * Uses a gradient stroke and subtle fill area.
 */
export default function BalanceTrendChart() {
  // dummy running balances (weekly)
  const data = [
    { period: "Jan", balance: 1200 },
    { period: "Feb", balance: 1800 },
    { period: "Mar", balance: 1500 },
    { period: "Apr", balance: 2400 },
    { period: "May", balance: 2900 },
    { period: "Jun", balance: 3100 },
  ];

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 8, bottom: 6 }}
        >
          <defs>
            <linearGradient id="lineGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#A068E4" stopOpacity={1} />
              <stop offset="100%" stopColor="#8B54D4" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(160,104,228,0.18)" />
              <stop offset="100%" stopColor="rgba(160,104,228,0.02)" />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="period" tick={{ fill: "#B8B8B8" }} axisLine={false} />
          <YAxis
            tickFormatter={(v) => `$${v}`}
            tick={{ fill: "#B8B8B8" }}
            axisLine={false}
          />
          <Tooltip
            wrapperStyle={{ background: "#1F1136", border: "none" }}
            contentStyle={{ color: "#000" }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="url(#lineGrad)"
            fill="url(#areaGrad)"
            strokeWidth={2.4}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="url(#lineGrad)"
            strokeWidth={2.4}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
