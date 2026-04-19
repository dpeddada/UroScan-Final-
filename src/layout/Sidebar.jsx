import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Activity, Monitor, Cpu, ArrowLeftRight,
  Bell, TrendingUp, Users, HeartPulse, Rocket, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/live-monitoring", label: "Live Monitoring", icon: Activity },
  { path: "/device-overview", label: "Device Overview", icon: Cpu },
  { path: "/comparison", label: "Manual vs Automated", icon: ArrowLeftRight },
  { path: "/alerts", label: "Alerts", icon: Bell },
  { path: "/historical", label: "Historical Trends", icon: TrendingUp },
  { path: "/role-views", label: "Role Views", icon: Users },
  { path: "/device-health", label: "Device Health", icon: HeartPulse },
  { path: "/roadmap", label: "Implementation", icon: Rocket },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1024);

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col z-40 transition-all duration-300 border-r border-sidebar-border",
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <Monitor className="w-4 h-4 text-accent-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-sidebar-foreground tracking-tight">UroTrack</h1>
            <p className="text-[10px] text-sidebar-foreground/60 leading-tight">Monitoring Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-sidebar-border text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
