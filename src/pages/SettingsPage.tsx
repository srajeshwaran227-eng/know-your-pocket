import { useState } from "react";
import { 
  ArrowLeft,
  Wallet,
  Bell,
  Tag,
  Trash2,
  Plus,
  Info,
  Mail,
  Github,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AppLayout } from "@/components/AppLayout";
import { useExpenseContext } from "@/contexts/ExpenseContext";
import { CategoryIcon, availableIcons } from "@/components/CategoryIcon";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { 
    budget, 
    categories, 
    updateBudget, 
    addCategory, 
    deleteCategory,
    clearAllData 
  } = useExpenseContext();

  const [monthlyLimit, setMonthlyLimit] = useState(budget.monthlyLimit.toString());
  const [alertThreshold, setAlertThreshold] = useState(budget.alertThreshold);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("ShoppingBag");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const handleSaveBudget = () => {
    const limit = parseFloat(monthlyLimit);
    if (isNaN(limit) || limit <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }
    updateBudget({ monthlyLimit: limit, alertThreshold });
    toast.success("Budget settings saved!");
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    addCategory({
      name: newCategoryName.trim(),
      icon: newCategoryIcon,
      color: `chart-${(categories.length % 6) + 1}`,
    });
    setNewCategoryName("");
    setNewCategoryIcon("ShoppingBag");
    setIsAddCategoryOpen(false);
    toast.success("Category added!");
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    toast.success("Category deleted");
  };

  const handleClearData = () => {
    clearAllData();
    toast.success("All data cleared");
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Settings</h1>
          </div>

          {/* Budget Settings */}
          <div className="bg-card rounded-2xl p-5 border border-border animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="font-semibold text-foreground">Monthly Budget</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="budget" className="text-muted-foreground">Budget Limit (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  className="mt-2 h-12 rounded-xl text-lg"
                  placeholder="10000"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Alert Threshold
                  </Label>
                  <span className="text-sm font-medium text-primary">{alertThreshold}%</span>
                </div>
                <Slider
                  value={[alertThreshold]}
                  onValueChange={([value]) => setAlertThreshold(value)}
                  max={100}
                  min={50}
                  step={5}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Get warned when you've spent {alertThreshold}% of your budget
                </p>
              </div>

              <Button 
                onClick={handleSaveBudget}
                className="w-full gradient-primary rounded-xl h-11"
              >
                Save Budget Settings
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-card rounded-2xl p-5 border border-border animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Tag className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="font-semibold text-foreground">Categories</h2>
              </div>
              
              <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Create a custom category for your expenses
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Category Name</Label>
                      <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g., Snacks"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block">Icon</Label>
                      <div className="grid grid-cols-6 gap-2">
                        {availableIcons.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => setNewCategoryIcon(icon)}
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                              newCategoryIcon === icon
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary hover:bg-secondary/80"
                            )}
                          >
                            <CategoryIcon iconName={icon} size={18} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCategory} className="gradient-primary">
                      Add Category
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                >
                  <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center">
                    <CategoryIcon iconName={category.icon} size={16} />
                  </div>
                  <span className="flex-1 text-foreground font-medium">{category.name}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will only delete the category. Existing expenses in this category will remain but may show as "Other".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </div>

          {/* Clear Data */}
          <div className="bg-card rounded-2xl p-5 border border-destructive/30 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Clear All Data</h2>
                <p className="text-sm text-muted-foreground">Delete all expenses and reset settings</p>
              </div>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full rounded-xl">
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your expenses, custom categories, and reset your budget settings. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, Clear Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* About */}
          <div className="bg-card rounded-2xl p-5 border border-border animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Info className="w-5 h-5 text-foreground" />
              </div>
              <h2 className="font-semibold text-foreground">About</h2>
            </div>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">StudentBudget</strong> helps college students track their daily expenses and avoid month-end money shortages.
              </p>
              <p>
                Built with ❤️ for students who want to take control of their finances without complexity.
              </p>
              <div className="pt-3 border-t border-border flex items-center gap-4">
                <a href="mailto:support@studentbudget.app" className="flex items-center gap-2 text-primary hover:underline">
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              </div>
            </div>
          </div>

          {/* Footer spacing */}
          <div className="h-4" />
        </div>
      </div>
    </AppLayout>
  );
}
