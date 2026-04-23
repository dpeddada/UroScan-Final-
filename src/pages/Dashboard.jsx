import { useState } from "react";
import SummaryCards from "@/components/dashboard/SummaryCards";
import RecentAlertsTable from "@/components/dashboard/RecentAlertsTable";
import PatientDeviceTable from "@/components/dashboard/PatientDeviceTable";
import { connectESP32, startReading } from "@/utils/bluetooth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
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

  const updateFromParsed = (parsed) => {
    const volumeNum = parsed.volume_ml ? parseFloat(parsed.volume_ml) : null;
    const flowNum = parsed.flow_rate_mLs ? parseFloat(parsed.flow_rate_mLs) : null;
    const turbidityNum = parsed.turbidity_rntu ? parseFloat(parsed.turbidity_rntu) : null;

    const statusText = parsed.status || "UNKNOWN";
    const flowFlag = parsed.motion_flag === "1";

    const fillPercent =
      volumeNum !== null
        ? Math.max(0, Math.min(100, Math.round((volumeNum / 2000) * 100)))
        : null;

    setSummaryData((prev) => ({
      ...prev,
      volume: volumeNum !== null && !Number.isNaN(volumeNum) ? `${volumeNum.toFixed(2)} mL` : prev.volume,
      flowState: flowFlag ? "Active" : "Idle",
      flowSub: flowNum !== null && !Number.isNaN(flowNum) ? `${flowNum.toFixed(2)} mL/s` : prev.flowSub,
      turbidity: turbidityNum !== null && !Number.isNaN(turbidityNum) ? `${turbidityNum.toFixed(1)} rNTU` : prev.turbidity,
      turbiditySub: parsed.turbidity_label ? `Label: ${parsed.turbidity_label}` : prev.turbiditySub,
      color: parsed.color_value || prev.color,
      colorSub: parsed.color_code !== undefined ? `Code: ${parsed.color_code}` : prev.colorSub,
      lastSync: "Just now",
      lastSyncSub: statusText,
      deviceStatus: statusText === "OK" ? "Connected" : "Warning",
      deviceSub: "UroScale",
      bagFill: fillPercent !== null && !Number.isNaN(fillPercent) ? `${fillPercent}%` : prev.bagFill,
      bagFillSub: volumeNum !== null && !Number.isNaN(volumeNum) ? `~${volumeNum.toFixed(2)} mL / 2,000 mL` : prev.bagFillSub,
    }));
  };

  const handleConnect = async () => {
    try {
      await connectESP32();
      setSummaryData((prev) => ({
        ...prev,
        deviceStatus: "Connected",
        lastSync: "Just now",
        lastSyncSub: "BLE connected",
      }));
    } catch (error) {
      alert(error.message);
      setSummaryData((prev) => ({ ...prev, deviceStatus: "Failed" }));
    }
  };

  const handleStartReading = async () => {
    try {
      await startReading(updateFromParsed);
    } catch (error) {
      alert(error.message);
      setSummaryData((prev) => ({ ...prev, deviceStatus: "Read Failed" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            ICU Unit A — Active device monitoring overview
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select defaultValue="pt-4821">
            <SelectTrigger className="h-8 text-xs w-36">
              <SelectValue placeholder="Patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-4821">PT-4821 • ICU-12</SelectItem>
              <SelectItem value="pt-3907">PT-3907 • ICU-08</SelectItem>
              <SelectItem value="pt-5134">PT-5134 • STEP-03</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="shift">
            <SelectTrigger className="h-8 text-xs w-28">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shift">Current Shift</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="48h">Last 48h</SelectItem>
            </SelectContent>
          </Select>

          <button onClick={handleConnect} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
            Connect ESP32
          </button>

          <button onClick={handleStartReading} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium">
            Start Reading
          </button>
        </div>
      </div>

      <SummaryCards summaryData={summaryData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentAlertsTable />
        <PatientDeviceTable />
      </div>
    </div>
  );
}
