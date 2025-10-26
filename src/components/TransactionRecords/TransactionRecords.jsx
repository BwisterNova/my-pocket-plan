import { useMemo, useState, useRef, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { FiTrash2, FiDownload } from "react-icons/fi";
import styles from "./transactionRecords.module.css";

export default function TransactionRecords() {
  // hidden transaction ids are persisted in AppContext so hides survive reloads
  const {
    transactions = [],
    hiddenTransactions = [],
    hideTransaction,
    unhideTransaction,
  } = useAppContext();

  // derive available months from transactions (from first transaction -> current)
  const availableRange = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      const now = new Date();
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return {
        start: { month: prev.getMonth(), year: prev.getFullYear() },
        end: { month: now.getMonth(), year: now.getFullYear() },
      };
    }
    const dates = transactions.map((t) => new Date(t.date));
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date();
    return {
      start: { month: min.getMonth(), year: min.getFullYear() },
      end: { month: max.getMonth(), year: max.getFullYear() },
    };
  }, [transactions]);

  // build year list from start.year .. end.year
  const years = useMemo(() => {
    const ys = [];
    for (let y = availableRange.start.year; y <= availableRange.end.year; y++)
      ys.push(y);
    return ys;
  }, [availableRange]);

  // month label format e.g. "Oct 2025"
  function monthDisplay(m) {
    const d = new Date(m.year, m.month, 1);
    return d.toLocaleString(undefined, { month: "short", year: "numeric" });
  }

  // format date like "Oct, 20, 2025"
  function formatDateIso(dateIso) {
    const d = new Date(dateIso);
    return (
      d.toLocaleString(undefined, { month: "short" }) +
      ", " +
      d.getDate() +
      ", " +
      d.getFullYear()
    );
  }

  // filter rows by type and month/year and hiddenIds
  // lastDeleted used for undo toast
  const [lastDeleted, setLastDeleted] = useState(null); // { id }
  const undoTimerRef = useRef(null);
  const countdownRef = useRef(null);
  const [countdown, setCountdown] = useState(0);

  // UI state: filter type and selected month/year for the list
  const [filterType, setFilterType] = useState("all");

  // selected month/year defaults to the availableRange end (most recent month)
  const [selected, setSelected] = useState(() => ({
    month: availableRange.end.month,
    year: availableRange.end.year,
  }));

  const [pickerOpen, setPickerOpen] = useState(false);

  const rowsToShow = useMemo(() => {
    return (transactions || [])
      .filter((r) => {
        if ((hiddenTransactions || []).includes(r.id)) return false;
        if (filterType === "manual") {
          return !!r.manual;
        }
        if (filterType === "income" || filterType === "expense") {
          return r.type === filterType;
        }
        return true;
      })
      .filter((r) => {
        const d = new Date(r.date);
        return (
          d.getMonth() === selected.month && d.getFullYear() === selected.year
        );
      });
  }, [transactions, filterType, selected, hiddenTransactions]);

  // delete (hide) transaction
  function handleDelete(id) {
    // hide persistently
    hideTransaction(id);
    setLastDeleted({ id });
    setCountdown(5);
    // start undo timeout
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => {
      setLastDeleted(null);
      undoTimerRef.current = null;
    }, 5000);

    // start countdown interval for visual feedback
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  // undo delete
  function handleUndo() {
    if (!lastDeleted) return;
    unhideTransaction(lastDeleted.id);
    setLastDeleted(null);
    setCountdown(0);
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // export visible rows as CSV
  function exportCSV() {
    const rows = rowsToShow || [];
    if (!rows.length) return;
    const headers = ["Date", "Type", "Category", "Amount", "Note"];
    const csv = [headers.join(",")]
      .concat(
        rows.map((r) => {
          const date = formatDateIso(r.date);
          const type = r.type;
          const category = r.category?.name || "";
          const amount = Number(r.amount || 0).toFixed(2);
          const note = (r.note || "").replace(/\n/g, " ").replace(/,/g, " ");
          return [date, type, category, amount, note].join(",");
        })
      )
      .join("\n");
    // create and download CSV file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const month = selected.month + 1;
    a.download = `transactions-${selected.year}-${String(month).padStart(
      2,
      "0"
    )}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // month/year picker confirm
  const [pickerMonth, setPickerMonth] = useState(selected.month);
  const [pickerYear, setPickerYear] = useState(selected.year);
  // open month/year picker
  function openPicker() {
    setPickerMonth(selected.month);
    setPickerYear(selected.year);
    setPickerOpen(true);
  }
  // month/year picker confirm
  function confirmPicker() {
    setSelected({ month: Number(pickerMonth), year: Number(pickerYear) });
    setPickerOpen(false);
  }
  // format amount with commas and 2 decimal places
  function formatAmount(n) {
    return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  return (
    <section className={styles.records} aria-label="Transaction Records">
      <div className={styles.headerRow}>
        <h2>Transaction Records</h2>
        {/* <MonthYearPicker /> */}
        <div className={styles.controls}>
          <button
            className={styles.exportBtn}
            title="Export visible records as CSV"
            onClick={exportCSV}
          >
            <FiDownload />
          </button>
          <div>
            <select
              id="typeSelect"
              className={styles.typeSelect}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Type (All)</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
              <option value="manual">Manual top up</option>
            </select>
          </div>

          <div className={styles.pickerWrap}>
            <button
              className={styles.pickerBtn}
              onClick={openPicker}
              aria-haspopup="dialog"
              aria-expanded={pickerOpen}
            >
              {monthDisplay(selected)} <span className={styles.caret}>▾</span>
            </button>
            {/* Month/Year Picker */}
            {pickerOpen && (
              <>
                <div
                  className={styles.pickerBackdrop}
                  onClick={() => setPickerOpen(false)}
                />
                <div
                  className={styles.pickerPopup}
                  role="dialog"
                  aria-modal="true"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Month Picker */}
                  <div className={styles.pickerColumns}>
                    <div className={styles.pickerColumn}>
                      <div className={styles.pickerLabel}>Month</div>
                      <div className={styles.pickerScroller}>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <button
                            key={i}
                            className={`${styles.pickerItem} ${
                              pickerMonth === i ? styles.pickerActive : ""
                            }`}
                            onClick={() => setPickerMonth(i)}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Year Picker */}
                    <div className={styles.pickerColumn}>
                      <div className={styles.pickerLabel}>Year</div>
                      <div className={styles.pickerScroller}>
                        {years.map((y) => (
                          <button
                            key={y}
                            className={`${styles.pickerItem} ${
                              pickerYear === y ? styles.pickerActive : ""
                            }`}
                            onClick={() => setPickerYear(y)}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.pickerActions}>
                    <button
                      className={styles.pickerConfirm}
                      onClick={confirmPicker}
                    >
                      Confirm
                    </button>
                    <button
                      className={styles.pickerCancel}
                      onClick={() => setPickerOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={styles.listBox}
        role="region"
        aria-label="Transaction list"
      >
        <div className={styles.tableHeader}>
          <div className={styles.colDate}>Date</div>
          <div className={styles.colType}>Type</div>
          <div className={styles.colCategory}>Category</div>
          <div className={styles.colAmount}>Amount</div>
          <div className={styles.colDelete}>Delete</div>
        </div>
        {/* Table body */}
        <div className={styles.tableBody}>
          {rowsToShow.length === 0 ? (
            <div className={styles.empty}>
              No records for the selected filters.
            </div>
          ) : (
            rowsToShow.map((r) => (
              <div className={styles.row} key={r.id}>
                <div className={styles.colDate}>{formatDateIso(r.date)}</div>
                <div className={styles.colType}>
                  <span
                    className={`${styles.typeBadge} ${
                      r.type === "income"
                        ? styles.typeIncome
                        : r.type === "expense"
                        ? styles.typeExpense
                        : ""
                    }`}
                  >
                    {r.type}
                  </span>
                </div>
                <div className={styles.colCategory}>
                  <span className={styles.catIcon}>{r.category?.icon}</span>
                  <span className={styles.catName}>{r.category?.name}</span>
                </div>
                <div className={styles.colAmount}>{formatAmount(r.amount)}</div>
                <div className={styles.colDelete}>
                  <button
                    className={styles.delIcon}
                    onClick={() => handleDelete(r.id)}
                    aria-label="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Undo toast */}
      {lastDeleted && (
        <div className={styles.undoToast} role="status">
          <span>Item deleted</span>
          <button className={styles.undoBtn} onClick={handleUndo}>
            Undo
          </button>
        </div>
      )}

      <p className={styles.note}>
        Delete hides an item from your records view but doesn't change totals or
        balance.
      </p>
    </section>
  );
}
