import { useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AppLayout } from "@/components/AppLayout";
import { useExpenseContext } from "@/contexts/ExpenseContext";
import { CategoryIcon } from "@/components/CategoryIcon";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from "date-fns";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { 
    expenses, 
    categories, 
    budget, 
    getExpensesByMonth, 
    getBudgetStatus,
    getCategoryById 
  } = useExpenseContext();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const { total, percentage, remaining, status } = getBudgetStatus(currentYear, currentMonth);
  const monthlyExpenses = getExpensesByMonth(currentYear, currentMonth);

  // Get last 7 days data for chart
  const weeklyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(now, 6 - i);
      const dayExpenses = expenses.filter(
        (exp) => format(new Date(exp.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );
      const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return {
        day: format(date, "EEE"),
        amount: total,
        isToday: format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd"),
      };
    });
    return last7Days;
  }, [expenses, now]);

  // Top spending category this month
  const topCategory = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    monthlyExpenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    let maxCategory = "";
    let maxAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      if (amount > maxAmount) {
        maxCategory = cat;
        maxAmount = amount;
      }
    });
    
    return maxCategory ? { category: getCategoryById(maxCategory), amount: maxAmount } : null;
  }, [monthlyExpenses, getCategoryById]);

  // Recent expenses (last 5)
  const recentExpenses = expenses.slice(0, 5);

  const statusColors = {
    safe: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
  };

  const statusTextColors = {
    safe: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">{format(now, "MMMM yyyy")}</p>
            </div>
            <Link to="/add">
              <Button size="icon" className="w-12 h-12 rounded-full gradient-primary shadow-lg">
                <Plus className="w-6 h-6" />
              </Button>
            </Link>
          </div>

          {/* Budget Status Card */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Budget</p>
                <p className="text-3xl font-bold text-foreground">
                  ₹{total.toLocaleString()}
                  <span className="text-lg font-normal text-muted-foreground">
                    {" "}/ ₹{budget.monthlyLimit.toLocaleString()}
                  </span>
                </p>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1",
                status === "safe" && "bg-success/20 text-success",
                status === "warning" && "bg-warning/20 text-warning",
                status === "danger" && "bg-destructive/20 text-destructive"
              )}>
                {status === "danger" && <AlertTriangle className="w-3 h-3" />}
                {status === "safe" && "On Track"}
                {status === "warning" && "Careful!"}
                {status === "danger" && "Over Budget!"}
              </div>
            </div>
            
            <Progress 
              value={Math.min(percentage, 100)} 
              className={cn("h-3 mb-3", statusColors[status])}
            />
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {percentage.toFixed(0)}% used
              </span>
              <span className={cn("font-medium", statusTextColors[status])}>
                {remaining >= 0 
                  ? `₹${remaining.toLocaleString()} left` 
                  : `₹${Math.abs(remaining).toLocaleString()} over`
                }
              </span>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {/* Today's Spending */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">Today</span>
              </div>
              <p className="text-xl font-bold text-foreground">
                ₹{weeklyData[6]?.amount.toLocaleString() || 0}
              </p>
            </div>

            {/* Top Category */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                {topCategory?.category ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <CategoryIcon iconName={topCategory.category.icon} className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {topCategory.category.name}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground">Top Category</span>
                  </>
                )}
              </div>
              <p className="text-xl font-bold text-foreground">
                ₹{topCategory?.amount.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Weekly Trend Chart */}
          <div className="bg-card rounded-2xl p-5 border border-border animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Last 7 Days</h2>
              <Link to="/reports" className="text-sm text-primary font-medium flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} barCategoryGap="20%">
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {weeklyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isToday ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Recent Expenses</h2>
              <Link to="/reports" className="text-sm text-primary font-medium flex items-center gap-1">
                See All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            {recentExpenses.length === 0 ? (
              <div className="bg-card rounded-xl p-8 border border-border text-center">
                <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No expenses yet</p>
                <Link to="/add">
                  <Button className="gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Expense
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentExpenses.map((expense) => {
                  const category = getCategoryById(expense.category);
                  return (
                    <div 
                      key={expense.id}
                      className="bg-card rounded-xl p-4 border border-border flex items-center gap-3"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        `bg-${category?.color || 'muted'}/20`
                      )} style={{ backgroundColor: `hsl(var(--${category?.color || 'muted'}) / 0.2)` }}>
                        <CategoryIcon 
                          iconName={category?.icon || "MoreHorizontal"} 
                          className="w-5 h-5"
                          size={20}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {category?.name || "Other"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(expense.date), "MMM d")}
                          {expense.notes && ` • ${expense.notes}`}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">
                        -₹{expense.amount.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
