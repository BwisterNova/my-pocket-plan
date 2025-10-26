import { useState, useEffect } from "react";

// Simple localStorage hook: [value, setValue, remove]
export default function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
      return typeof initialValue === "function" ? initialValue() : initialValue;
    } catch (err) {
      console.warn(`useLocalStorage read error for key ${key}:`, err);
      return typeof initialValue === "function" ? initialValue() : initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.warn(`useLocalStorage write error for key ${key}:`, err);
    }
  }, [key, state]);

  const remove = () => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn(`useLocalStorage remove error for key ${key}:`, err);
    }
    setState(
      typeof initialValue === "function" ? initialValue() : initialValue
    );
  };

  return [state, setState, remove];
}
