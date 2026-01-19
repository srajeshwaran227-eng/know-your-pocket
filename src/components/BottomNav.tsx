import { NavLink, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, PlusCircle, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/add", icon: PlusCircle, label: "Add", isMain: true },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;

          if (item.isMain) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center justify-center -mt-6"
              >
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg transform transition-transform active:scale-95">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-[60px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-1", isActive && "animate-scale-in")} />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
