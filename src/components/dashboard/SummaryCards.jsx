import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Droplets,
  Activity,
  Eye,
  Palette,
  AlertTriangle,
  RefreshCw,
  Wifi,
  Gauge
} from "lucide-react";
import { connectESP32, startReading } from "../../utils/bluetooth";

export default function SummaryCards() {
  const [summaryData, setSummaryData] = useState({
    volume: "1,847 mL",
    flowState: "Active",
    flowSub: "Since 14:12",
    turbidity: "Clear",
    turbiditySub: "Clarity: 92%",
    color: "Light Yellow",
    colorSub: "Normal range",
    alerts: "3",
    alertsSub: "1 critical",
    lastSync: "12s ago",
    lastSyncSub: "Real-time",
    deviceStatus: "Disconnected",
    deviceSub: "UT-001",
    bagFill: "64%",
    bagFillSub: "~1,280 mL / 2,000 mL"
  });

  const handleConnect = async () => {
    try {
      await connectESP32();
      setSummaryData((prev) => ({
        ...prev,
        deviceStatus: "Connected",
        lastSync: "Just now"
      }));
    } catch (error) {
      console.error(error);
      setSummaryData((prev) => ({
        ...prev,
        deviceStatus: "Failed"
      }));
    }
  };

  const handleStartReading = async () => {
    try {
      await startReading((value) => {
        let parsed;

        try {
          parsed = JSON.parse(value);
        } catch {
          console.log("Non-JSON data received:", value);
          return;
        }

        setSummaryData((prev) => ({
          ...prev,
          volume: parsed.volume ? `${parsed.volume} mL` : prev.volume,
          flowState: parsed.flowState || prev.flowState,
          turbidity: parsed.turbidity || prev.turbidity,
          color: parsed.color || prev.color,
          bagFill: parsed.bagFill ? `${parsed.bagFill}%` : prev.bagFill,
          lastSync: "Just now",
          deviceStatus: "Connected"
        }));
      });
    } catch (error) {
      console.error(error);
    }
  };

  const cards = [
    {
      label: "Total Volume",
      value: summaryData.volume,
      sub: "Current shift",
      icon: Droplets,
      color: "text-chart-1",
      bg: "bg-chart-1/10"
    },
    {
      label: "Flow State",
      value: summaryData.flowState,
      sub: summaryData.flowSub,
      icon: Activity,
      color: "text-success",
      bg: "bg-success/10"
    },
    {
      label: "Turbidity",
      value: summaryData.turbidity,
      sub: summaryData.turbiditySub,
      icon: Eye,
      color: "text-chart-2",
      bg: "bg-chart-2/10"
    },
    {
      label: "Urine Color",
      value: summaryData.color,
      sub: summaryData.colorSub,
      icon: Palette,
      color: "text-chart-3",
      bg: "bg-chart-3/10"
    },
    {
      label: "Active Alerts",
      value: summaryData.alerts,
      sub: summaryData.alertsSub,
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10"
    },
    {
      label: "Last Sync",
      value: summaryData.lastSync,
      sub: summaryData.lastSyncSub,
      icon: RefreshCw,
      color: "text-chart-2",
      bg: "bg-chart-2/10"
    },
    {
      label: "Device Status",
      value: summaryData.deviceStatus,
      sub: summaryData.deviceSub,
      icon: Wifi,
      color:
        summaryData.deviceStatus === "Connected"
          ? "text-success"
          : "text-destructive",
      bg:
        summaryData.deviceStatus === "Connected"
          ? "bg-success/10"
          : "bg-destructive/10"
    },
    {
      label: "Bag Fill",
      value: summaryData.bagFill,
      sub: summaryData.bagFillSub,
      icon: Gauge,
      color: "text-chart-1",
      bg: "bg-chart-1/10"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={handleConnect}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          Connect ESP32
        </button>

        <button
          onClick={handleStartReading}
          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
        >
          Start Reading
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((card) => (
          <Card
            key={card.label}
            className="p-4 border border-border bg-card hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
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

            <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
            <p className="text-lg font-bold text-foreground mt-0.5">{card.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{card.sub}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
