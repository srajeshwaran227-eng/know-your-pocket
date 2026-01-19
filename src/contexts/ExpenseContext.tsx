import React, { createContext, useContext, ReactNode } from "react";
import { useExpenses } from "@/hooks/useExpenses";

type ExpenseContextType = ReturnType<typeof useExpenses>;

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const expenseData = useExpenses();

  return (
    <ExpenseContext.Provider value={expenseData}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenseContext() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenseContext must be used within an ExpenseProvider");
  }
  return context;
}
