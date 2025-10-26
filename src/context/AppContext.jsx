import React, { createContext, useContext, useMemo, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AppContext = createContext(null);

// default categories used across the app
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

// No built-in default goals: the app starts with zero goals unless the user adds one.

export function AppProvider({ children }) {
  const [transactions, setTransactions, removeTransactions] = useLocalStorage(
    "transactions",
    []
  );
  // start with an empty goals list by default (user must add goals)
  const [goals, setGoals, removeGoals] = useLocalStorage("goals", []);
  const [currentBalance, setCurrentBalance, removeCurrentBalance] =
    useLocalStorage("currentBalance", 0);
  const [categories, setCategories, removeCategories] = useLocalStorage(
    "categories",
    defaultCategories
  );

  // Persist list of hidden (soft-deleted) transaction IDs so hides survive reloads
  const [hiddenTransactions, setHiddenTransactions, removeHiddenTransactions] =
    useLocalStorage("hiddenTransactions", []);

  // Add manual top-up to balance (used by DashboardCard's + Add)
  function addManualBalance(amount) {
    const n = Number(amount);
    if (isNaN(n) || n <= 0)
      return { success: false, message: "Invalid amount" };

    // Create a manual transaction so the top-up can be edited/reset later
    const manualTx = {
      id: Date.now(),
      amount: n,
      type: "income",
      category: { icon: "🔼", name: "Manual top-up" },
      date: new Date().toISOString().split("T")[0],
      note: "Manual top-up",
      manual: true,
    };
    setTransactions((prev) => [...(prev || []), manualTx]);
    setCurrentBalance((prev) => Number(prev || 0) + n);
    return { success: true };
  }

  // Add a transaction and update balance accordingly
  // transaction: { amount, type: 'income'|'expense', category, date, note }
  function addTransaction(tx) {
    const amount = Number(tx.amount);
    if (isNaN(amount) || amount <= 0)
      return { success: false, message: "Invalid amount" };

    if (tx.type === "expense" && amount > Number(currentBalance || 0)) {
      return {
        success: false,
        message: "insufficient",
      };
    }

    const newTx = { id: Date.now(), ...tx, amount };
    setTransactions((prev) => [...(prev || []), newTx]);

    setCurrentBalance((prev) => {
      const p = Number(prev || 0);
      return tx.type === "income" ? p + amount : p - amount;
    });

    return { success: true };
  }

  // Remove a transaction and roll its amount back into balance appropriately
  function removeTransaction(id) {
    const tx = (transactions || []).find((t) => t.id === id);
    if (!tx) return { success: false, message: "not found" };
    setTransactions((prev) => (prev || []).filter((t) => t.id !== id));
    setCurrentBalance((prev) => {
      const p = Number(prev || 0);
      return tx.type === "income"
        ? p - Number(tx.amount || 0)
        : p + Number(tx.amount || 0);
    });
    return { success: true };
  }

  // Edit existing transaction (adjusts balance by the delta)
  function editTransaction(id, updates) {
    const tx = (transactions || []).find((t) => t.id === id);
    if (!tx) return { success: false, message: "not found" };
    const newAmount =
      updates.amount !== undefined ? Number(updates.amount) : Number(tx.amount);
    if (isNaN(newAmount)) return { success: false, message: "invalid amount" };
    const delta = newAmount - Number(tx.amount || 0);
    setTransactions((prev) =>
      (prev || []).map((t) =>
        t.id === id ? { ...t, ...updates, amount: newAmount } : t
      )
    );
    setCurrentBalance((prev) => {
      const p = Number(prev || 0);
      return tx.type === "income" ? p + delta : p - delta;
    });
    return { success: true };
  }

  // Totals derived from transactions
  const totals = useMemo(() => {
    const t = transactions || [];
    const totalIncome = t
      .filter((x) => x.type === "income")
      .reduce((s, x) => s + Number(x.amount || 0), 0);
    const totalExpenses = t
      .filter((x) => x.type === "expense")
      .reduce((s, x) => s + Number(x.amount || 0), 0);
    return { totalIncome, totalExpenses };
  }, [transactions]);

  // Goals aggregation
  const goalsSummary = useMemo(() => {
    const g = goals || [];
    const totalSaved = g.reduce((s, x) => s + Number(x.saved || 0), 0);
    const totalTarget = g.reduce((s, x) => s + Number(x.target || 0), 0);
    return { totalSaved, totalTarget };
  }, [goals]);

  // Add new goal
  function addGoal(goal) {
    const g = {
      id: Date.now(),
      ...goal,
      saved: Number(goal.saved || 0),
      completed: !!goal.completed,
    };
    setGoals((prev) => [...(prev || []), g]);
    return { success: true };
  }

  // Add to savings: deducts from currentBalance and increments goal.saved (if funds available)
  function addToSavings(goalId, amount) {
    const n = Number(amount);
    if (isNaN(n) || n <= 0)
      return { success: false, message: "Invalid amount" };
    if (n > Number(currentBalance || 0))
      return { success: false, message: "insufficient" };

    setGoals((prev) =>
      (prev || []).map((g) =>
        g.id === goalId ? { ...g, saved: Number(g.saved || 0) + n } : g
      )
    );

    setCurrentBalance((prev) => Number(prev || 0) - n);
    return { success: true };
  }

  // Add custom category
  function addCategory(type, category) {
    if (!["income", "expense"].includes(type)) return;
    setCategories((prev) => ({
      ...(prev || defaultCategories),
      [type]: [...((prev && prev[type]) || []), category],
    }));
  }

  // Reset stored data
  function resetData(which = "all") {
    if (which === "transactions") setTransactions([]);
    else if (which === "goals") setGoals([]);
    else if (which === "all") {
      setTransactions([]);
      // clear goals on a nuclear reset (no default goals are re-added)
      setGoals([]);
      setCurrentBalance(0);
      setCategories(defaultCategories);
    }
  }

  // Soft-hide a transaction (does not affect totals/currentBalance)
  function hideTransaction(id) {
    setHiddenTransactions((prev) => {
      const set = new Set(prev || []);
      set.add(id);
      return Array.from(set);
    });
  }

  function unhideTransaction(id) {
    setHiddenTransactions((prev) => (prev || []).filter((x) => x !== id));
  }

  const value = {
    transactions,
    removeTransaction,
    editTransaction,
    setTransactions,
    hiddenTransactions,
    hideTransaction,
    unhideTransaction,
    goals,
    setGoals,
    currentBalance: Number(currentBalance || 0),
    setCurrentBalance,
    categories,
    setCategories,
    addManualBalance,
    addTransaction,
    totals,
    addGoal,
    goalsSummary,
    addToSavings,
    addCategory,
    resetData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}

export default AppContext;
