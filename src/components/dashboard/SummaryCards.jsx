import { Card } from "@/components/ui/card";
import { Droplets, Activity, Eye, Palette, AlertTriangle, RefreshCw, Wifi, Gauge } from "lucide-react";

const cards = [
  { label: "Total Volume", value: "1,847 mL", sub: "Current shift", icon: Droplets, color: "text-chart-1", bg: "bg-chart-1/10" },
  { label: "Flow State", value: "Active", sub: "Since 14:12", icon: Activity, color: "text-success", bg: "bg-success/10" },
  { label: "Turbidity", value: "Clear", sub: "Clarity: 92%", icon: Eye, color: "text-chart-2", bg: "bg-chart-2/10" },
  { label: "Urine Color", value: "Light Yellow", sub: "Normal range", icon: Palette, color: "text-chart-3", bg: "bg-chart-3/10" },
  { label: "Active Alerts", value: "3", sub: "1 critical", icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  { label: "Last Sync", value: "12s ago", sub: "Real-time", icon: RefreshCw, color: "text-chart-2", bg: "bg-chart-2/10" },
  { label: "Device Status", value: "Connected", sub: "UT-001", icon: Wifi, color: "text-success", bg: "bg-success/10" },
  { label: "Bag Fill", value: "64%", sub: "~1,280 mL / 2,000 mL", icon: Gauge, color: "text-chart-1", bg: "bg-chart-1/10" },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <Card key={card.label} className="p-4 border border-border bg-card hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
              <card.icon className={`w-4.5 h-4.5 ${card.color}`} />
            </div>
            {card.label === "Flow State" && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-live-pulse" />
                <span className="text-[9px] font-semibold text-success uppercase tracking-wider">Live</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
          <p className="text-lg font-bold text-foreground mt-0.5">{card.value}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{card.sub}</p>
        </Card>
      ))}
    </div>
  );
}
