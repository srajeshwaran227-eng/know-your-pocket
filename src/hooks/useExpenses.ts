import { useState, useEffect, useCallback } from "react";
import { Expense, Category, Budget, DEFAULT_CATEGORIES, DEFAULT_BUDGET, ExpenseState } from "@/types/expense";

const STORAGE_KEY = "studentbudget_data";

const getInitialState = (): ExpenseState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        expenses: parsed.expenses || [],
        categories: parsed.categories || DEFAULT_CATEGORIES,
        budget: parsed.budget || DEFAULT_BUDGET,
      };
    }
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
  }
  return {
    expenses: [],
    categories: DEFAULT_CATEGORIES,
    budget: DEFAULT_BUDGET,
  };
};

export function useExpenses() {
  const [state, setState] = useState<ExpenseState>(getInitialState);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [state]);

  const addExpense = useCallback((expense: Omit<Expense, "id" | "createdAt">) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses],
    }));
    return newExpense;
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    }));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((exp) => exp.id !== id),
    }));
  }, []);

  const addCategory = useCallback((category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };
    setState((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat.id !== id),
    }));
  }, []);

  const updateBudget = useCallback((budget: Partial<Budget>) => {
    setState((prev) => ({
      ...prev,
      budget: { ...prev.budget, ...budget },
    }));
  }, []);

  const clearAllData = useCallback(() => {
    setState({
      expenses: [],
      categories: DEFAULT_CATEGORIES,
      budget: DEFAULT_BUDGET,
    });
  }, []);

  // Computed values
  const getExpensesByMonth = useCallback(
    (year: number, month: number) => {
      return state.expenses.filter((exp) => {
        const date = new Date(exp.date);
        return date.getFullYear() === year && date.getMonth() === month;
      });
    },
    [state.expenses]
  );

  const getExpensesByDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return state.expenses.filter((exp) => {
        const date = new Date(exp.date);
        return date >= startDate && date <= endDate;
      });
    },
    [state.expenses]
  );

  const getTotalByMonth = useCallback(
    (year: number, month: number) => {
      return getExpensesByMonth(year, month).reduce(
        (sum, exp) => sum + exp.amount,
        0
      );
    },
    [getExpensesByMonth]
  );

  const getCategoryById = useCallback(
    (id: string) => {
      return state.categories.find((cat) => cat.id === id);
    },
    [state.categories]
  );

  const getBudgetStatus = useCallback(
    (year: number, month: number) => {
      const total = getTotalByMonth(year, month);
      const { monthlyLimit, alertThreshold } = state.budget;
      const percentage = (total / monthlyLimit) * 100;
      const remaining = monthlyLimit - total;

      let status: "safe" | "warning" | "danger" = "safe";
      if (percentage >= 100) {
        status = "danger";
      } else if (percentage >= alertThreshold) {
        status = "warning";
      }

      return { total, percentage, remaining, status };
    },
    [getTotalByMonth, state.budget]
  );

  return {
    expenses: state.expenses,
    categories: state.categories,
    budget: state.budget,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    updateBudget,
    clearAllData,
    getExpensesByMonth,
    getExpensesByDateRange,
    getTotalByMonth,
    getCategoryById,
    getBudgetStatus,
  };
}
