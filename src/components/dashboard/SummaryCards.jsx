import { Card } from "../ui/card";
import {
  Droplets,
  Activity,
  Eye,
  Palette,
  AlertTriangle,
  RefreshCw,
  Wifi,
  Gauge,
} from "lucide-react";

export default function SummaryCards({ summaryData }) {
  const cards = [
    {
      label: "Total Volume",
      value: summaryData.volume,
      sub: "Live reading",
      icon: Droplets,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      label: "Flow State",
      value: summaryData.flowState,
      sub: summaryData.flowSub,
      icon: Activity,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Turbidity",
      value: summaryData.turbidity,
      sub: summaryData.turbiditySub,
      icon: Eye,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      label: "Urine Color",
      value: summaryData.color,
      sub: summaryData.colorSub,
      icon: Palette,
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
    {
      label: "Active Alerts",
      value: summaryData.alerts,
      sub: summaryData.alertsSub,
      icon: AlertTriangle,
      color: summaryData.alerts !== "0" ? "text-destructive" : "text-success",
      bg: summaryData.alerts !== "0" ? "bg-destructive/10" : "bg-success/10",
    },
    {
      label: "Last Sync",
      value: summaryData.lastSync,
      sub: summaryData.lastSyncSub,
      icon: RefreshCw,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      label: "Device Status",
      value: summaryData.deviceStatus,
      sub: summaryData.deviceSub,
      icon: Wifi,
      color:
        summaryData.deviceStatus === "Connected"
          ? "text-success"
          : summaryData.deviceStatus === "Warning"
          ? "text-warning"
          : "text-destructive",
      bg:
        summaryData.deviceStatus === "Connected"
          ? "bg-success/10"
          : summaryData.deviceStatus === "Warning"
          ? "bg-warning/10"
          : "bg-destructive/10",
    },
    {
      label: "Bag Fill",
      value: summaryData.bagFill,
      sub: summaryData.bagFillSub,
      icon: Gauge,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="p-4 border border-border bg-card hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}
            >
              <card.icon className={`w-4.5 h-4.5 ${card.color}`} />
            </div>

            {card.label === "Flow State" && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-live-pulse" />
                <span className="text-[9px] font-semibold text-success uppercase tracking-wider">
                  Live
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground font-medium">
            {card.label}
          </p>
          <p className="text-lg font-bold text-foreground mt-0.5">
            {card.value}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {card.sub}
          </p>
        </Card>
      ))}
    </div>
  );
}
