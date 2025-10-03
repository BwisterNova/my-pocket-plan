import { useState } from "react";
import styles from "./theme.module.css";

// Accent color swatches
const accentColors = [
  { name: "Purple", value: "#7c3aed" },
  { name: "Blue", value: "#2563eb" },
  { name: "Green", value: "#22c55e" },
  { name: "Pink", value: "#ec4899" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Yellow", value: "#eab308" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Gray", value: "#64748b" },
];

export default function Theme() {
  // Theme mode: light, dark, system
  const [themeMode, setThemeMode] = useState("system");
  // Accent color
  const [accent, setAccent] = useState(accentColors[0].value);

  // Preview card style
  const previewStyles = {
    background:
      themeMode === "dark"
        ? "linear-gradient(135deg, #232946 60%, #1f1136 100%)"
        : "linear-gradient(135deg, #eef2ff 60%, #e0e7ff 100%)",
    color: themeMode === "dark" ? "#fff" : "#232946",
    border: `2px solid ${accent}`,
    boxShadow: `0 4px 24px ${accent}33`,
  };

  // Reset to default
  function handleReset() {
    setThemeMode("system");
    setAccent(accentColors[0].value);
  }

  // Save changes (for now, just a UI placeholder)
  function handleSave() {
    // Placeholder: would save to localStorage or backend
    alert("Theme settings saved! (UI only)");
  }

  return (
    <div className={styles.themeSettings}>
      {/* Theme Mode Toggle Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Theme Mode</h2>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="themeMode"
              value="light"
              checked={themeMode === "light"}
              onChange={() => setThemeMode("light")}
            />
            Light
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="themeMode"
              value="dark"
              checked={themeMode === "dark"}
              onChange={() => setThemeMode("dark")}
            />
            Dark
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="themeMode"
              value="system"
              checked={themeMode === "system"}
              onChange={() => setThemeMode("system")}
            />
            System Default
          </label>
        </div>
      </section>

      {/* Accent Color Selection Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Accent Color</h2>
        <div className={styles.swatchGroup}>
          {accentColors.map((color) => (
            <button
              key={color.value}
              className={
                accent === color.value
                  ? `${styles.swatch} ${styles.selected}`
                  : styles.swatch
              }
              style={{ background: color.value }}
              onClick={() => setAccent(color.value)}
              aria-label={color.name}
            >
              {accent === color.value && (
                <span className={styles.check}>✓</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Preview</h2>
        <div className={styles.previewCard} style={previewStyles}>
          <div className={styles.previewHeader}>My Pocket Plan</div>
          <div className={styles.previewBody}>
            <span
              className={styles.previewAccent}
              style={{ background: accent }}
            />
            <p>
              {themeMode === "dark"
                ? "Dark Mode Preview"
                : themeMode === "light"
                ? "Light Mode Preview"
                : "System Default Preview"}
            </p>
            <small style={{ color: accent }}>
              Accent: {accentColors.find((c) => c.value === accent)?.name}
            </small>
          </div>
        </div>
      </section>

      {/* Save / Reset Section */}
      <section className={styles.section}>
        <div className={styles.buttonRow}>
          <button className={styles.saveBtn} onClick={handleSave}>
            Save Changes
          </button>
          <button className={styles.resetBtn} onClick={handleReset}>
            Reset to Default
          </button>
        </div>
      </section>
    </div>
  );
}
