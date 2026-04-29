import { useEffect, useState } from "react";
import SummaryCards from "../components/dashboard/SummaryCards";
import RecentAlertsTable from "../components/dashboard/RecentAlertsTable";
import PatientDeviceTable from "../components/dashboard/PatientDeviceTable";
import {
  connectESP32,
  startReading,
  disconnectESP32,
} from "../utils/bluetooth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState({
    volume: "0.00 mL",
    flowState: "Idle",
    flowSub: "0.00 mL/s",
    peakFlowRate: "0.00 mL/s",
    turbidity: "Clear",
    turbidityLabel: "Clear",
    turbiditySub: "0.0 rNTU",
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

  const [alerts, setAlerts] = useState([]);
  const [peakFlowRate, setPeakFlowRate] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    return () => {
      disconnectESP32();
    };
  }, []);

  const cleanMessage = (message) => {
    if (!message || message === "OK") return "No active alerts";

    return message
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const buildAlerts = (parsed, time) => {
    const newAlerts = [];

    if (parsed.alert_turbidity === "1") {
      newAlerts.push({
        severity: "warning",
        time,
        message: "High Turbidity",
      });
    }

    if (parsed.alert_color === "1") {
      newAlerts.push({
        severity: "warning",
        time,
        message: "Abnormal Color",
      });
    }

    if (parsed.alert_flow === "1") {
      newAlerts.push({
        severity: "warning",
        time,
        message: "Flow Alert",
      });
    }

    if (parsed.alert_motion === "1") {
      newAlerts.push({
        severity: "warning",
        time,
        message: "Motion Detected",
      });
    }

    if (parsed.alert_message && parsed.alert_message !== "OK") {
      newAlerts.push({
        severity: parsed.alert_level === "WARNING" ? "warning" : "ok",
        time,
        message: cleanMessage(parsed.alert_message),
      });
    }

    return newAlerts;
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connectESP32();

      setSummaryData((prev) => ({
        ...prev,
        deviceStatus: "Connected",
        lastSync: "Just now",
        lastSyncSub: "BLE connected",
      }));
    } catch (error) {
      alert(error.message);
      setSummaryData((prev) => ({
        ...prev,
        deviceStatus: "Failed",
        lastSync: "Connection failed",
        lastSyncSub: "Check BLE device",
      }));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleStartReading = async () => {
    try {
      setIsReading(true);

      await startReading((parsed) => {
        if (parsed.lineType !== "DATA") return;

        const time = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const volumeNum = parseFloat(parsed.volume_ml);
        const flowNum = parseFloat(parsed.flow_rate_mLs);
        const turbidityNum = parseFloat(parsed.turbidity_rntu);
        const colorCode = parseInt(parsed.color_code, 10);
        const flowFlag = String(parsed.motion_flag) === "1";
        const statusText = parsed.status || "UNKNOWN";

        const safeFlow = Number.isFinite(flowNum) ? flowNum : 0;
        const nextPeakFlow = Math.max(peakFlowRate, safeFlow);

        setPeakFlowRate(nextPeakFlow);

        const realAlerts = buildAlerts(parsed, time);
        setAlerts(realAlerts);

        const fillPercent = Number.isFinite(volumeNum)
          ? Math.max(0, Math.min(100, Math.round((volumeNum / 2000) * 100)))
          : null;

        setSummaryData((prev) => ({
          ...prev,

          volume: Number.isFinite(volumeNum)
            ? `${volumeNum.toFixed(2)} mL`
            : prev.volume,

          flowState: flowFlag ? "Active" : "Idle",

          flowSub: Number.isFinite(flowNum)
            ? `${flowNum.toFixed(2)} mL/s`
            : prev.flowSub,

          peakFlowRate: `${nextPeakFlow.toFixed(2)} mL/s`,

          turbidity: parsed.turbidity_label || prev.turbidity,
          turbidityLabel: parsed.turbidity_label || prev.turbidityLabel,

          turbiditySub: Number.isFinite(turbidityNum)
            ? `${turbidityNum.toFixed(1)} rNTU`
            : prev.turbiditySub,

          color: parsed.color_value || prev.color,

          colorSub: Number.isFinite(colorCode)
            ? `Code: ${colorCode}`
            : prev.colorSub,

          alerts: String(realAlerts.length),
          alertsSub:
            realAlerts.length > 0
              ? realAlerts.map((a) => a.message).join(" • ")
              : "No active alerts",

          lastSync: "Just now",
          lastSyncSub: statusText,

          deviceStatus: statusText === "OK" ? "Connected" : "Warning",
          deviceSub: "UroScale",

          bagFill:
            fillPercent !== null && Number.isFinite(fillPercent)
              ? `${fillPercent}%`
              : prev.bagFill,

          bagFillSub: Number.isFinite(volumeNum)
            ? `~${volumeNum.toFixed(2)} mL / 2,000 mL`
            : prev.bagFillSub,
        }));
      });
    } catch (error) {
      alert(error.message);
      setIsReading(false);

      setSummaryData((prev) => ({
        ...prev,
        deviceStatus: "Read Failed",
        lastSync: "Read failed",
        lastSyncSub: "Check parser / notifications",
      }));
    }
  };

  const handleDisconnect = async () => {
    await disconnectESP32();
    setIsReading(false);
    setAlerts([]);
    setPeakFlowRate(0);

    setSummaryData((prev) => ({
      ...prev,
      deviceStatus: "Disconnected",
      lastSync: "Disconnected",
      lastSyncSub: "BLE stopped",
      flowState: "Idle",
      flowSub: "0.00 mL/s",
      peakFlowRate: "0.00 mL/s",
      alerts: "0",
      alertsSub: "No active alerts",
    }));
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
            disabled={isConnecting || summaryData.deviceStatus === "Connected"}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {isConnecting ? "Connecting..." : "Connect ESP32"}
          </button>

          <button
            onClick={handleStartReading}
            disabled={
              isReading ||
              (summaryData.deviceStatus !== "Connected" &&
                summaryData.deviceStatus !== "Warning")
            }
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-60 transition"
          >
            {isReading ? "Reading..." : "Start Reading"}
          </button>

          <button
            onClick={handleDisconnect}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
          >
            Disconnect
          </button>
        </div>
      </div>

      <SummaryCards summaryData={summaryData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentAlertsTable alerts={alerts} />
        <PatientDeviceTable />
      </div>
    </div>
  );
}
