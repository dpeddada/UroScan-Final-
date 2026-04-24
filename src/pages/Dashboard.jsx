import { useEffect, useState } from "react";
import SummaryCards from "../components/dashboard/SummaryCards";
import FlowRateChart from "../components/dashboard/FlowRateChart";
import RecentAlertsTable from "../components/dashboard/RecentAlertsTable";
import PatientDeviceTable from "../components/dashboard/PatientDeviceTable";
import {
  connectESP32,
  startReading,
  disconnectESP32,
} from "../utils/bluetooth";

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
  });

  const [flowRateHistory, setFlowRateHistory] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    return () => {
      disconnectESP32();
    };
  }, []);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connectESP32();

      setSummaryData((prev) => ({
        ...prev,
        deviceStatus: "Connected",
        lastSync: "Just now",
      }));
    } catch (error) {
      alert(error.message);
      setSummaryData((prev) => ({
        ...prev,
        deviceStatus: "Failed",
      }));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleStartReading = async () => {
    try {
      setIsReading(true);

      await startReading((parsed) => {
        const time = new Date().toLocaleTimeString("en-US", {
          minute: "2-digit",
          second: "2-digit",
        });

        const volumeNum = parseFloat(parsed.volume_ml);
        const flowNum = parseFloat(parsed.flow_rate_mLs);
        const turbidityNum = parseFloat(parsed.turbidity_rntu);
        const flowFlag = String(parsed.motion_flag) === "1";

        setSummaryData((prev) => ({
          ...prev,
          volume: Number.isFinite(volumeNum)
            ? `${volumeNum.toFixed(2)} mL`
            : prev.volume,
          flowState: flowFlag ? "Active" : "Idle",
          flowSub: Number.isFinite(flowNum)
            ? `${flowNum.toFixed(2)} mL/s`
            : prev.flowSub,
          turbidity: Number.isFinite(turbidityNum)
            ? `${turbidityNum.toFixed(1)} rNTU`
            : prev.turbidity,
          lastSync: "Just now",
        }));

        if (Number.isFinite(flowNum)) {
          setFlowRateHistory((prev) => [
            ...prev.slice(-59),
            { time, flowRate: flowNum },
          ]);
        }
      });
    } catch (error) {
      alert(error.message);
      setIsReading(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectESP32();
    setIsReading(false);
    setFlowRateHistory([]);

    setSummaryData((prev) => ({
      ...prev,
      deviceStatus: "Disconnected",
      flowState: "Idle",
      lastSync: "Disconnected",
    }));
  };

  return (
    <div className="space-y-6">
      {/* 🔴 ALWAYS VISIBLE BUTTON */}
      <button
        onClick={handleDisconnect}
        className="fixed top-4 right-4 z-[9999] px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold shadow-lg"
      >
        Disconnect
      </button>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-xs text-muted-foreground">
          ICU Unit A — Monitoring Overview
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleConnect}
          disabled={isConnecting || summaryData.deviceStatus === "Connected"}
          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm"
        >
          {isConnecting ? "Connecting..." : "Connect"}
        </button>

        <button
          onClick={handleStartReading}
          disabled={
            isReading ||
            summaryData.deviceStatus !== "Connected"
          }
          className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm"
        >
          {isReading ? "Reading..." : "Start"}
        </button>
      </div>

      {/* Summary */}
      <SummaryCards summaryData={summaryData} />

      {/* Graph */}
      <FlowRateChart data={flowRateHistory} />

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentAlertsTable />
        <PatientDeviceTable />
      </div>
    </div>
  );
}
