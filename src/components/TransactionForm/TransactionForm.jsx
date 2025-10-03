import styles from "./transactionForm.module.css";
import { useState } from "react";

//Default categories
const defaultCategories = {
  income: [
    { icon: "💼", name: "Salary" },
    { icon: "📈", name: "Assets" },
    { icon: "🏢", name: "Business" },
    { icon: "🎁", name: "Gift" },
  ],
  expense: [
    { icon: "🍔", name: "Food" },
    { icon: "🚗", name: "Transport" },
    { icon: "💡", name: "Bills" },
    { icon: "🛒", name: "Shopping" },
  ],
};

// Emoji icon options for modal
const initialIconOptions = [
  "💼",
  "📈",
  "🏢",
  "🎁",
  "🍔",
  "🚗",
  "💡",
  "🛒",
  "🏠",
  "🎉",
  "🧾",
  "🛍️",
  "🍕",
  "🚕",
  "🧃",
  "💊",
  "🎓",
  "🧸",
  "🧹",
  "🛏️",
  "🧴",
];

export default function TransactionForm() {
  // The state for form inputs
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income"); // 'income' or 'expense'
  const [categories, setCategories] = useState(defaultCategories);
  const [category, setCategory] = useState(defaultCategories[type][0]);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  //Transaction List
  const [transactions, setTransactions] = useState([]);

  //For the modal popup
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState(initialIconOptions[0]);
  const [iconOptions, setIconOptions] = useState(initialIconOptions);
  const [customIcon, setCustomIcon] = useState(null);
  const [emojiInputRef, setEmojiInputRef] = useState(null);

  // Validation state
  const [amountError, setAmountError] = useState("");
  const [dateError, setDateError] = useState("");
  // See more/less state
  const [showAll, setShowAll] = useState(false);

  // Handle adding the transaction
  function handleAddTransaction(e) {
    e.preventDefault();
    let valid = true;
    // Validate amount
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setAmountError("Please enter a valid amount greater than 0.");
      valid = false;
    } else {
      setAmountError("");
    }
    // Validate date
    if (!date) {
      setDateError("Please select a valid date.");
      valid = false;
    } else {
      setDateError("");
    }
    if (!valid) return;
    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      type,
      category,
      date,
      note,
    };
    setTransactions([...transactions, newTransaction]);
    setAmount("");
    setNote("");
    setDate("");
    setCategory(categories[type][0]);
  }

  // Delete transaction
  const handleDelete = (id) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  // Save new category
  function handleSaveCategory() {
    if (!newCategoryName.trim()) return;
    const newCat = { icon: newCategoryIcon, name: newCategoryName };
    setCategories((prev) => ({
      ...prev,
      [type]: [...prev[type], newCat],
    }));
    setCategory(newCat);
    setShowCategoryModal(false);
    setNewCategoryName("");
    setNewCategoryIcon(initialIconOptions[0]);
  }

  // Handle custom icon upload
  function handleCustomIconUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        setIconOptions((prev) => [...prev, ev.target.result]);
        setNewCategoryIcon(ev.target.result);
        setCustomIcon(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // When type changes, reset category to first of that type
  function handleTypeChange(e) {
    const newType = e.target.value;
    setType(newType);
    setCategory(categories[newType][0]);
  }

  // Focus emoji input when + is clicked
  function handlePlusClick() {
    if (emojiInputRef) {
      emojiInputRef.focus();
    }
  }

  // Format the raw date into readable format
  function formatDate(dateString) {
    if (!dateString) return "";
    const userLocale = navigator.language || "en-US";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Intl.DateTimeFormat(userLocale, options).format(
      new Date(dateString)
    );
  }

  return (
    <div className={styles.container}>
      {/* Add Transaction Form */}
      <form className={styles.form} onSubmit={handleAddTransaction}>
        <h2>Add New Transaction</h2>
        {/* Amount */}
        <label>Amount</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        {/* Attractive validation message for amount */}
        {amountError && (
          <div className={styles.errorMsg}>
            <span role="img" aria-label="error">
              ❗
            </span>{" "}
            {amountError}
          </div>
        )}
        {/* Type */}
        <div className={styles.typeRow}>
          <span className={styles.typeLabel}>Type:</span>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="type"
                value="income"
                checked={type === "income"}
                onChange={handleTypeChange}
                required
              />
              Income
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="expense"
                checked={type === "expense"}
                onChange={handleTypeChange}
                required
              />
              Expense
            </label>
          </div>
        </div>
        {/* Category */}
        <label>Category</label>
        <select
          value={category.name}
          onChange={(e) => {
            if (e.target.value === "addNew") {
              setShowCategoryModal(true);
            } else {
              const selected = categories[type].find(
                (cat) => cat.name === e.target.value
              );
              setCategory(selected);
            }
          }}
        >
          {categories[type].map((cat, index) => (
            <option key={index} value={cat.name}>
              {cat.icon} {cat.name}
            </option>
          ))}
          <option value="addNew">➕ Add New Category</option>
        </select>
        {/* Date */}
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        {/* Attractive validation message for date */}
        {dateError && (
          <div className={styles.errorMsg}>
            <span role="img" aria-label="error">
              📅
            </span>{" "}
            {dateError}
          </div>
        )}
        {/* Note */}
        <label>Note</label>
        <textarea
          placeholder="Enter a note (Optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        {/* Submit Button */}
        <button type="submit" className={styles.addBtn}>
          Add Transaction
        </button>
      </form>
      {/* Transaction List */}
      {transactions.length > 0 && (
        <div className={styles.transactions}>
          <h3>Transactions</h3>
          {/* Show only first 3 transactions unless showAll is true */}
          <div className={styles.txGrid}>
            {(showAll ? transactions : transactions.slice(0, 3)).map(
              (tx, index) => (
                <div key={tx.id} className={styles.txCard}>
                  <div className={styles.txHeader}>
                    <span className={styles.txNumber}>{index + 1}.</span>
                    <span className={styles.txIcon}>{tx.category.icon}</span>
                    <span className={styles.txName}>{tx.category.name}</span>
                    <span className={styles.txType}>{tx.type}</span>
                  </div>
                  <div className={styles.txDetails}>
                    <span className={styles.txAmount}>${tx.amount}</span>
                    <span className={styles.txDate}>{formatDate(tx.date)}</span>
                  </div>
                  {tx.note && <p className={styles.note}>{tx.note}</p>}
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(tx.id)}
                  >
                    Delete
                  </button>
                </div>
              )
            )}
          </div>
          {/* See More / See Less button */}
          {transactions.length > 3 && (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                className={styles.seeMoreBtn}
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll ? "See Less" : "See More"}
              </button>
            </div>
          )}
        </div>
      )}
      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Add New Category</h3>
            <div className={styles.iconGrid}>
              {initialIconOptions.map((icon, idx) => (
                <span
                  key={icon + idx}
                  className={
                    icon === newCategoryIcon
                      ? styles.iconSelected
                      : styles.iconOption
                  }
                  onClick={() => setNewCategoryIcon(icon)}
                  style={{ cursor: "pointer", fontSize: "1.5rem" }}
                >
                  {icon}
                </span>
              ))}
              {/* Plus button for emoji input */}
              <span
                className={styles.iconOption}
                style={{
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  position: "relative",
                }}
                onClick={handlePlusClick}
                title="On Windows: Win + . or Win + ; | On Mac: Cmd + Ctrl + Space"
              >
                +
                <input
                  ref={(ref) => setEmojiInputRef(ref)}
                  type="text"
                  maxLength={2}
                  style={{
                    position: "absolute",
                    left: "-9999px",
                  }}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  placeholder="Emoji"
                />
              </span>
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: "#b8b8b8",
                marginBottom: "0.5rem",
              }}
            >
              Tip: On Windows, use <b>Win + .</b> or <b>Win + ;</b> to open the
              emoji picker. On Mac, use <b>Cmd + Ctrl + Space</b>.
            </div>
            <label>
              Name:
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </label>
            <div className={styles.modalBtns}>
              <button
                onClick={handleSaveCategory}
                className={styles.modalButtons}
              >
                Save
              </button>
              <button
                onClick={() => setShowCategoryModal(false)}
                className={styles.modalButtons}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
