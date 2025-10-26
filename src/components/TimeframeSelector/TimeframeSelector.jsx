import React from "react";
import styles from "./timeframeSelector.module.css";

export default function TimeframeSelector({
  value,
  onChange,
  options = ["Day", "Week", "Month"],
}) {
  return (
    <div className={styles.wrapper}>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        aria-label="Select timeframe"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
