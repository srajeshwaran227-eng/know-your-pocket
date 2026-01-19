import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Plus,
  Check,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppLayout } from "@/components/AppLayout";
import { useExpenseContext } from "@/contexts/ExpenseContext";
import { CategoryIcon } from "@/components/CategoryIcon";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AddExpensePage() {
  const navigate = useNavigate();
  const { categories, addExpense } = useExpenseContext();
  
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || "");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    setIsSubmitting(true);

    addExpense({
      amount: numAmount,
      category: selectedCategory,
      date: new Date(date).toISOString(),
      notes: notes.trim() || undefined,
    });

    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setAmount("");
      setNotes("");
      setSelectedCategory(categories[0]?.id || "");
      setDate(format(new Date(), "yyyy-MM-dd"));
      setIsSubmitting(false);
      toast.success("Expense added successfully!");
    }, 1000);
  };

  if (showSuccess) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center animate-bounce-in">
            <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Expense Added!</h2>
            <p className="text-muted-foreground">Keep tracking to stay on budget 💪</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Add Expense</h1>
          </div>

          {/* Amount Input */}
          <div className="bg-card rounded-2xl p-6 border border-border mb-6 animate-fade-in">
            <label className="text-sm text-muted-foreground mb-2 block">Amount</label>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-foreground">₹</span>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-4xl font-bold border-0 p-0 h-auto focus-visible:ring-0 bg-transparent placeholder:text-muted"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <label className="text-sm text-muted-foreground mb-3 block">Category</label>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    selectedCategory === category.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    selectedCategory === category.id
                      ? "gradient-primary"
                      : "bg-secondary"
                  )}>
                    <CategoryIcon 
                      iconName={category.icon} 
                      className={cn(
                        selectedCategory === category.id
                          ? "text-primary-foreground"
                          : "text-foreground"
                      )}
                      size={18}
                    />
                  </div>
                  <span className={cn(
                    "text-xs font-medium truncate w-full text-center",
                    selectedCategory === category.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}>
                    {category.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <label className="text-sm text-muted-foreground mb-2 block">Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-card"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <label className="text-sm text-muted-foreground mb-2 block">Notes (optional)</label>
            <Textarea
              placeholder="What was this for?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl bg-card resize-none"
              rows={2}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !amount}
            className="w-full h-14 rounded-xl gradient-primary text-lg font-semibold shadow-lg animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                Adding...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Expense
              </span>
            )}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
