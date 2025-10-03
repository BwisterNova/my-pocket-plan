import styles from "./currencySettings.module.css";
import { useState } from "react";

// Common world currencies (symbol, code, name)
const currencies = [
  { code: "USD", symbol: "$", name: "United States Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "CHF", symbol: "₣", name: "Swiss Franc" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound" },
];

export default function CurrencySettings() {
  // Current currency (default: USD)
  const [current, setCurrent] = useState(currencies[0]);
  // Search filter for dropdown
  const [search, setSearch] = useState("");
  // Preview amount
  const previewAmount = 2562.5;

  // Filtered currencies for selector
  const filtered = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Reset to default
  function handleReset() {
    setCurrent(currencies[0]);
    setSearch("");
  }

  // Save changes (UI only)
  function handleSave() {
    alert("Currency settings saved! (UI only)");
  }

  return (
    <div className={styles.currencySettings}>
      {/* Header with sticker */}
      <div className={styles.headerRow}>
        <h2 className={styles.headerTitle}>Currency Settings</h2>
        <span className={styles.sticker}>💱</span>
      </div>

      {/* Current Currency Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Current Currency</h3>
        <div className={styles.currentCurrency}>
          <span className={styles.currencySymbol}>{current.symbol}</span>
          <span className={styles.currencyCode}>{current.code}</span>
          <span className={styles.currencyName}>{current.name}</span>
        </div>
      </section>

      {/* Currency Selector Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Select Currency</h3>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search currency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.dropdownList}>
          {filtered.map((c) => (
            <button
              key={c.code}
              className={
                c.code === current.code
                  ? `${styles.dropdownItem} ${styles.selected}`
                  : styles.dropdownItem
              }
              onClick={() => setCurrent(c)}
            >
              <span className={styles.currencySymbol}>{c.symbol}</span>
              <span className={styles.currencyCode}>{c.code}</span>
              <span className={styles.currencyName}>{c.name}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className={styles.noResult}>No currencies found.</div>
          )}
        </div>
      </section>

      {/* Preview Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Preview</h3>
        <div className={styles.previewCard}>
          <span className={styles.previewSymbol}>{current.symbol}</span>
          <span className={styles.previewAmount}>
            {current.symbol}
            {previewAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className={styles.previewCode}>{current.code}</span>
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
