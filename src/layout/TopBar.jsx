import { Bell, Wifi, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export default function TopBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-live-pulse" />
          <span className="text-xs font-semibold text-success">SYSTEM ONLINE</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wifi className="w-3.5 h-3.5" />
          <span>6 Devices Connected</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <button className="relative p-1.5 rounded-md hover:bg-muted transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-destructive rounded-full text-[8px] font-bold text-destructive-foreground flex items-center justify-center">3</span>
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium leading-none">Nurse Station</p>
            <p className="text-[10px] text-muted-foreground">ICU Unit A</p>
          </div>
        </div>
      </div>
    </header>
  );
}
