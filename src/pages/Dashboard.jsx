import { useState } from "react";
import SummaryCards from "@/components/dashboard/SummaryCards";
import LiveVolumeChart from "@/components/dashboard/LiveVolumeChart";
import FlowStateChart from "@/components/dashboard/FlowStateChart";
import TurbidityChart from "@/components/dashboard/TurbidityChart";
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

  const [volumeHistory, setVolumeHistory] = useState([]);
  const [flowHistory, setFlowHistory] = useState([]);
  const [turbidityHistory, setTurbidityHistory] = useState([]);

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
      alert(error.message);

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
        const time = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const volumeNum =
          parsed.volume_ml !== undefined
            ? parseFloat(parsed.volume_ml)
            : null;

        const flowNum =
          parsed.flow_rate_mLs !== undefined
            ? parseFloat(parsed.flow_rate_mLs)
            : null;

        const turbidityNum =
          parsed.turbidity_rntu !== undefined
            ? parseFloat(parsed.turbidity_rntu)
            : null;

        const alerts = [];
        const statusText = parsed.status || "UNKNOWN";
        const flowFlag = String(parsed.motion_flag) === "1";

        if (statusText !== "OK") alerts.push("Telemetry issue");
        if (flowFlag) alerts.push("Flow active");
        if (parsed.turbidity_sat === "YES") alerts.push("Turbidity saturated");
        if (parsed.turbidity_bdl === "YES") alerts.push("Below detection");

        const fillPercent =
          volumeNum !== null && !Number.isNaN(volumeNum)
            ? Math.max(0, Math.min(100, Math.round((volumeNum / 2000) * 100)))
            : null;

        setSummaryData((prev) => ({
          ...prev,
          volume:
            volumeNum !== null && !Number.isNaN(volumeNum)
              ? `${volumeNum.toFixed(2)} mL`
              : prev.volume,

          flowState: flowFlag ? "Active" : "Idle",

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

          alerts: String(alerts.length),
          alertsSub: alerts.length > 0 ? alerts.join(" • ") : "No active alerts",

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

        if (volumeNum !== null && !Number.isNaN(volumeNum)) {
          setVolumeHistory((prev) => [
            ...prev.slice(-59),
            { time, volume: volumeNum },
          ]);
        }

        if (flowNum !== null && !Number.isNaN(flowNum)) {
          setFlowHistory((prev) => [
            ...prev.slice(-59),
            { time, flow: flowFlag ? 1 : 0 },
          ]);
        }

        if (turbidityNum !== null && !Number.isNaN(turbidityNum)) {
          setTurbidityHistory((prev) => [
            ...prev.slice(-59),
            { time, turbidity: turbidityNum },
          ]);
        }
      });
    } catch (error) {
      console.error(error);
      alert(error.message);

      setSummaryData((prev) => ({
        ...prev,
        deviceStatus: "Read Failed",
        lastSync: "Read failed",
        lastSyncSub: "Check parser / notifications",
      }));
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
      </div>

      <SummaryCards summaryData={summaryData} />

      <div className="p-3 rounded-lg border border-border bg-card text-sm text-foreground">
        Volume points: {volumeHistory.length} | Flow points: {flowHistory.length} | Turbidity points: {turbidityHistory.length}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LiveVolumeChart data={volumeHistory} />
        <FlowStateChart data={flowHistory} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TurbidityChart data={turbidityHistory} />
        <RecentAlertsTable />
        <PatientDeviceTable />
      </div>
    </div>
  );
}
