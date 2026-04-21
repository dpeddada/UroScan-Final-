import { useState } from "react";
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
import { connectESP32, startReading } from "../../utils/bluetooth";

export default function SummaryCards() {
  const [summaryData, setSummaryData] = useState({
    volume: "0.00 mL",
    flowState: "Idle",
    flowSub: "0.00 mL/s",
    turbidity: "0.0 rNTU",
    turbiditySub: "Label: A",
    color: "NA",
    colorSub: "Code: -1",
    alerts: "0",
    alertsSub: "No active alerts",
    lastSync: "Not connected",
    lastSyncSub: "BLE idle",
    deviceStatus: "Disconnected",
    deviceSub: "UroScale",
    bagFill: "0%",
    bagFillSub: "~0.00 mL / 2,000 mL",
  });

  const handleConnect = async () => {
    try {
      await connectESP32();
      setSummaryData((prev) => ({
        ...prev,
        deviceStatus: "Connected",
        deviceSub: "UroScale",
        lastSync: "Just now",
        lastSyncSub: "BLE connected",
      }));
    } catch (error) {
      console.error(error);
      setSummaryData((prev) => ({
        ...prev,
        deviceStatus: "Failed",
        lastSync: "Connection failed",
        lastSyncSub: "Check BLE device",
      }));
    }
  };

  const handleStartReading = async () => {
    try {
      await startReading((parsed) => {
        const volumeNum = parsed.volume_ml ? parseFloat(parsed.volume_ml) : null;
        const flowNum = parsed.flow_rate_mLs
          ? parseFloat(parsed.flow_rate_mLs)
          : null;
        const turbidityNum = parsed.turbidity_rntu
          ? parseFloat(parsed.turbidity_rntu)
          : null;
        const batteryAlerts = [];
        const statusText = parsed.status || "UNKNOWN";

        if (statusText !== "OK") batteryAlerts.push("Telemetry issue");
        if (parsed.motion_flag === "1") batteryAlerts.push("Flow active");
        if (parsed.turbidity_sat === "YES") batteryAlerts.push("Turbidity saturated");
        if (parsed.turbidity_bdl === "YES") batteryAlerts.push("Below detection");

        const fillPercent =
          volumeNum !== null
            ? Math.max(0, Math.min(100, Math.round((volumeNum / 2000) * 100)))
            : null;

        setSummaryData((prev) => ({
          ...prev,
          volume:
            volumeNum !== null && !Number.isNaN(volumeNum)
              ? `${volumeNum.toFixed(2)} mL`
              : prev.volume,

          flowState:
            parsed.motion_flag === "1"
              ? "Active"
              : parsed.motion_flag === "0"
              ? "Idle"
              : prev.flowState,

          flowSub:
            flowNum !== null && !Number.isNaN(flowNum)
              ? `${flowNum.toFixed(2)} mL/s`
              : prev.flowSub,

          turbidity:
            turbidityNum !== null && !Number.isNaN(turbidityNum)
              ? `${turbidityNum.toFixed(1)} rNTU`
              : prev.turbidity,

          turbiditySub: parsed.turbidity_label
            ? `Label: ${parsed.turbidity_label}`
            : prev.turbiditySub,

          color: parsed.color_value || prev.color,

          colorSub:
            parsed.color_code !== undefined
              ? `Code: ${parsed.color_code}`
              : prev.colorSub,

          alerts: String(batteryAlerts.length),

          alertsSub:
            batteryAlerts.length > 0
              ? batteryAlerts.join(" • ")
              : "No active alerts",

          lastSync: "Just now",
          lastSyncSub: statusText,

          deviceStatus: statusText === "OK" ? "Connected" : "Warning",
          deviceSub: "UroScale",

          bagFill:
            fillPercent !== null && !Number.isNaN(fillPercent)
              ? `${fillPercent}%`
              : prev.bagFill,

          bagFillSub:
            volumeNum !== null && !Number.isNaN(volumeNum)
              ? `~${volumeNum.toFixed(2)} mL / 2,000 mL`
              : prev.bagFillSub,
        }));
      });
    } catch (error) {
      console.error(error);
      setSummaryData((prev) => ({
        ...prev,
        deviceStatus: "Read Failed",
        lastSync: "Read failed",
        lastSyncSub: "Check parser / notifications",
      }));
    }
  };

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
    </div>
  );
}
