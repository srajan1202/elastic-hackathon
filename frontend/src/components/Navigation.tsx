import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Building2,
  MessageCircle,
  Search,
  Settings,
  Leaf,
  Globe,
  TrendingUp,
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Admin", href: "/admin", icon: Settings },
];

export function Navigation() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl shadow-primary">
          <Leaf className="w-6 h-6 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">
              CarbonScope
            </h1>
            <p className="text-sm text-sidebar-foreground/60">
              ESG Intelligence
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start gap-3 transition-smooth",
                  isCollapsed && "justify-center px-2",
                  isActive &&
                    "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm",
                  !isActive &&
                    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent/50",
            isCollapsed && "justify-center"
          )}
        >
          <TrendingUp className="w-5 h-5 text-sidebar-accent-foreground" />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground">
                ESG Score
              </p>
              <p className="text-xs text-sidebar-accent-foreground/60">
                Real-time monitoring
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-sidebar-border bg-sidebar shadow-sm"
      >
        <svg
          className={cn(
            "w-3 h-3 transition-transform",
            isCollapsed && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Button>
    </div>
  );
}
