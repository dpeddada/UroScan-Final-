import { useEffect, useState } from "react";
import FlowRateChart from "../components/dashboard/FlowRateChart";
import RecentAlertsTable from "../components/dashboard/RecentAlertsTable";
import PatientDeviceTable from "../components/dashboard/PatientDeviceTable";
import { Card } from "../components/ui/card";
import {
  connectESP32,
  startReading,
  disconnectESP32,
} from "../utils/bluetooth";

export default function Dashboard() {
  const [deviceStatus, setDeviceStatus] = useState("Disconnected");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [flowRateHistory, setFlowRateHistory] = useState([]);

  const [currentReadings, setCurrentReadings] = useState({
    volume_ml: "0.00",
    flow_rate_mLs: "0.00",
    turbidity_rntu: "0.0",
    turbidity_label: "A",
    color_value: "NA",
    color_code: -1,
    motion_flag: "0",
    status: "IDLE",
  });

  useEffect(() => {
    return () => {
      disconnectESP32();
    };
  }, []);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setDeviceStatus("Connecting...");
      await connectESP32();
      setDeviceStatus("Connected");
    } catch (error) {
      alert(error.message);
      setDeviceStatus("Failed");
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

        const volume = parseFloat(parsed.volume_ml);
        const flowRate = parseFloat(parsed.flow_rate_mLs);
        const turbidity = parseFloat(parsed.turbidity_rntu);
        const colorCode = parseInt(parsed.color_code, 10);

        setCurrentReadings({
          volume_ml: Number.isFinite(volume) ? volume.toFixed(2) : "0.00",
          flow_rate_mLs: Number.isFinite(flowRate)
            ? flowRate.toFixed(2)
            : "0.00",
          turbidity_rntu: Number.isFinite(turbidity)
            ? turbidity.toFixed(1)
            : "0.0",
          turbidity_label: parsed.turbidity_label || "A",
          color_value: parsed.color_value || "NA",
          color_code: Number.isFinite(colorCode) ? colorCode : -1,
          motion_flag: parsed.motion_flag || "0",
          status: parsed.status || "UNKNOWN",
        });

        setDeviceStatus(parsed.status === "OK" ? "Connected" : "Warning");

        if (Number.isFinite(flowRate)) {
          setFlowRateHistory((prev) => [
            ...prev.slice(-59),
            { time, flowRate },
          ]);
        }
      });
    } catch (error) {
      alert(error.message);
      setDeviceStatus("Read Failed");
      setIsReading(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectESP32();
    setDeviceStatus("Disconnected");
    setIsReading(false);
    setFlowRateHistory([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            ICU Unit A — Active device monitoring overview
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleConnect}
            disabled={isConnecting || deviceStatus === "Connected"}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
          >
            {isConnecting ? "Connecting..." : "Connect ESP32"}
          </button>

          <button
            onClick={handleStartReading}
            disabled={
              isReading ||
              (deviceStatus !== "Connected" && deviceStatus !== "Warning")
            }
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium disabled:opacity-60"
          >
            {isReading ? "Reading..." : "Start Reading"}
          </button>

          <button
            onClick={handleDisconnect}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium"
          >
            Disconnect
          </button>
        </div>
      </div>

      <Card className="p-4 border border-border">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Device Status</p>
            <p className="font-semibold">{deviceStatus}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Volume</p>
            <p className="font-semibold">{currentReadings.volume_ml} mL</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Flow Rate</p>
            <p className="font-semibold">
              {currentReadings.flow_rate_mLs} mL/s
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Turbidity</p>
            <p className="font-semibold">
              Label: {currentReadings.turbidity_label}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentReadings.turbidity_rntu} rNTU
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Color</p>
            <p className="font-semibold">{currentReadings.color_value}</p>
            <p className="text-xs text-muted-foreground">
              Code: {currentReadings.color_code}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Motion Flag</p>
            <p className="font-semibold">{currentReadings.motion_flag}</p>
          </div>
        </div>
      </Card>

      <FlowRateChart data={flowRateHistory} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentAlertsTable />
        <PatientDeviceTable />
      </div>
    </div>
  );
}
