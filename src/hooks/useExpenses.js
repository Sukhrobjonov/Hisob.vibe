import { useState, useEffect } from 'react';

const STORAGE_KEY = 'hisob_vibe_expenses';
const LIMIT_KEY = 'hisob_vibe_limit';

export function useExpenses() {
  const [expenses, setExpenses] = useState(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  const [limit, setLimit] = useState(() => {
    try {
      const item = window.localStorage.getItem(LIMIT_KEY);
      return item ? parseInt(item, 10) : 500000;
    } catch (error) {
      return 500000;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error(error);
    }
  }, [expenses]);

  useEffect(() => {
    window.localStorage.setItem(LIMIT_KEY, limit.toString());
  }, [limit]);

  const addExpense = (expense) => {
    setExpenses((prev) => [
      { 
        id: Date.now().toString() + Math.random().toString(36).substring(2), 
        ...expense 
      },
      ...prev
    ]);
  };

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  return { expenses, addExpense, removeExpense, limit, setLimit };
}
