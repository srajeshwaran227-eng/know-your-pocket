import { useState, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/AppLayout";
import { useExpenseContext } from "@/contexts/ExpenseContext";
import { CategoryIcon } from "@/components/CategoryIcon";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, addMonths } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "hsl(262, 83%, 58%)",
  "hsl(168, 76%, 42%)",
  "hsl(350, 85%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(200, 85%, 55%)",
  "hsl(280, 70%, 55%)",
];

export default function ReportsPage() {
  const { expenses, categories, getCategoryById, budget } = useExpenseContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get expenses for current month
  const monthlyExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const date = new Date(exp.date);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    });
  }, [expenses, currentYear, currentMonth]);

  const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Category breakdown
  const categoryData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    monthlyExpenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    return Object.entries(categoryTotals)
      .map(([categoryId, amount], index) => {
        const category = getCategoryById(categoryId);
        return {
          id: categoryId,
          name: category?.name || "Other",
          icon: category?.icon || "MoreHorizontal",
          value: amount,
          percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
          color: CHART_COLORS[index % CHART_COLORS.length],
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [monthlyExpenses, getCategoryById, totalSpent]);

  // Daily breakdown for bar chart
  const dailyData = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const dayExpenses = monthlyExpenses.filter(
        (exp) => format(new Date(exp.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
      );
      return {
        date: format(day, "d"),
        amount: dayExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      };
    });
  }, [monthlyExpenses, currentDate]);

  // Compare with previous month
  const previousMonthTotal = useMemo(() => {
    const prevDate = subMonths(currentDate, 1);
    const prevMonth = prevDate.getMonth();
    const prevYear = prevDate.getFullYear();
    
    return expenses
      .filter((exp) => {
        const date = new Date(exp.date);
        return date.getFullYear() === prevYear && date.getMonth() === prevMonth;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses, currentDate]);

  const monthDiff = previousMonthTotal > 0 
    ? ((totalSpent - previousMonthTotal) / previousMonthTotal) * 100 
    : 0;

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => 
      direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const exportData = () => {
    const csvContent = [
      ["Date", "Category", "Amount", "Notes"],
      ...monthlyExpenses.map((exp) => [
        format(new Date(exp.date), "yyyy-MM-dd"),
        getCategoryById(exp.category)?.name || "Other",
        exp.amount.toString(),
        exp.notes || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${format(currentDate, "yyyy-MM")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Header with Month Navigation */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportData}
              className="rounded-lg"
              disabled={monthlyExpenses.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Month Selector */}
          <div className="flex items-center justify-center gap-4 bg-card rounded-xl p-3 border border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth("prev")}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-lg font-semibold text-foreground min-w-[140px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth("next")}
              className="rounded-full"
              disabled={currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Summary Card */}
          <div className="bg-card rounded-2xl p-5 border border-border animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-foreground">
                  ₹{totalSpent.toLocaleString()}
                </p>
              </div>
              {previousMonthTotal > 0 && (
                <div className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
                  monthDiff > 0 
                    ? "bg-destructive/20 text-destructive" 
                    : "bg-success/20 text-success"
                )}>
                  {monthDiff > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(monthDiff).toFixed(0)}%
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {previousMonthTotal > 0 && (
                <>vs ₹{previousMonthTotal.toLocaleString()} last month</>
              )}
            </p>
          </div>

          {monthlyExpenses.length > 0 ? (
            <>
              {/* Pie Chart */}
              <div className="bg-card rounded-2xl p-5 border border-border animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <h2 className="font-semibold text-foreground mb-4">Spending by Category</h2>
                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Category Legend */}
                <div className="space-y-2">
                  {categoryData.map((category, index) => (
                    <div key={category.id} className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <CategoryIcon iconName={category.icon} size={16} />
                      </div>
                      <span className="flex-1 text-sm text-foreground truncate">
                        {category.name}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        ₹{category.value.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {category.percentage.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Spending Bar Chart */}
              <div className="bg-card rounded-2xl p-5 border border-border animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <h2 className="font-semibold text-foreground mb-4">Daily Spending</h2>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        interval="preserveStartEnd"
                      />
                      <Tooltip 
                        formatter={(value: number) => [`₹${value.toLocaleString()}`, "Spent"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar 
                        dataKey="amount" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* All Expenses List */}
              <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <h2 className="font-semibold text-foreground mb-4">
                  All Expenses ({monthlyExpenses.length})
                </h2>
                <div className="space-y-2">
                  {monthlyExpenses
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((expense) => {
                      const category = getCategoryById(expense.category);
                      return (
                        <div 
                          key={expense.id}
                          className="bg-card rounded-xl p-4 border border-border flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <CategoryIcon 
                              iconName={category?.icon || "MoreHorizontal"} 
                              size={20}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {category?.name || "Other"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(expense.date), "MMM d, yyyy")}
                              {expense.notes && ` • ${expense.notes}`}
                            </p>
                          </div>
                          <p className="font-semibold text-foreground">
                            ₹{expense.amount.toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-2xl p-8 border border-border text-center animate-fade-in">
              <p className="text-muted-foreground">No expenses recorded for this month</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
