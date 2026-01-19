export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO date string
  notes?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Budget {
  monthlyLimit: number;
  alertThreshold: number; // percentage (0-100)
}

export interface ExpenseState {
  expenses: Expense[];
  categories: Category[];
  budget: Budget;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "food", name: "Food & Drinks", icon: "UtensilsCrossed", color: "chart-1" },
  { id: "transport", name: "Transport", icon: "Car", color: "chart-2" },
  { id: "shopping", name: "Shopping", icon: "ShoppingBag", color: "chart-3" },
  { id: "entertainment", name: "Entertainment", icon: "Gamepad2", color: "chart-4" },
  { id: "education", name: "Education", icon: "BookOpen", color: "chart-5" },
  { id: "bills", name: "Bills & Utilities", icon: "Receipt", color: "chart-6" },
  { id: "health", name: "Health", icon: "Heart", color: "chart-1" },
  { id: "other", name: "Other", icon: "MoreHorizontal", color: "chart-2" },
];

export const DEFAULT_BUDGET: Budget = {
  monthlyLimit: 10000,
  alertThreshold: 80,
};
