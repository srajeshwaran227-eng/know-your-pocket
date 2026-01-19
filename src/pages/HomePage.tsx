import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  TrendingUp, 
  PieChart, 
  Bell, 
  ArrowRight,
  Sparkles,
  Shield,
  Zap
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

export default function HomePage() {
  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="px-4 pt-12 pb-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Free Forever • No Sign-up</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 animate-slide-up">
              <span className="text-gradient">StudentBudget</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Stop wondering where your money went. Start tracking in seconds.
            </p>

            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-lg font-medium text-foreground mb-2">
                😰 "It's the 20th and I'm already broke..."
              </p>
              <p className="text-muted-foreground">
                Sound familiar? You're not alone. Most students lose track of small daily expenses until it's too late.
              </p>
            </div>

            <Link to="/dashboard">
              <Button size="lg" className="w-full gradient-primary text-primary-foreground font-semibold text-lg h-14 rounded-xl shadow-lg animate-slide-up" style={{ animationDelay: "0.3s" }}>
                Start Tracking Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-8 bg-secondary/30">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              How It Works
            </h2>
            
            <div className="space-y-4">
              {[
                { step: 1, icon: Wallet, title: "Log Your Expense", desc: "Takes less than 10 seconds" },
                { step: 2, icon: PieChart, title: "See Where Money Goes", desc: "Beautiful charts show your habits" },
                { step: 3, icon: Bell, title: "Stay on Budget", desc: "Get alerts before you overspend" },
              ].map((item, index) => (
                <div 
                  key={item.step}
                  className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border animate-slide-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary bg-secondary px-2 py-0.5 rounded-full">
                        Step {item.step}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-8">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Why Students Love It
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Zap, title: "Super Fast", desc: "Add expense in 3 taps" },
                { icon: Shield, title: "100% Private", desc: "Data stays on your device" },
                { icon: TrendingUp, title: "Smart Insights", desc: "See spending patterns" },
                { icon: Sparkles, title: "Custom Categories", desc: "Track your way" },
              ].map((feature, index) => (
                <div 
                  key={feature.title}
                  className="bg-card p-4 rounded-xl border border-border text-center animate-scale-in"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-8 pb-24">
          <div className="max-w-lg mx-auto">
            <div className="gradient-primary rounded-2xl p-6 text-center text-primary-foreground">
              <h2 className="text-xl font-bold mb-2">Ready to Take Control?</h2>
              <p className="text-primary-foreground/80 mb-4">
                Join thousands of students who've stopped stressing about money.
              </p>
              <Link to="/add">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Add Your First Expense
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
