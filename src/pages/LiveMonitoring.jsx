import { useEffect, useState } from "react";
import FlowRateChart from "../components/dashboard/FlowRateChart";
import VolumeChart from "../components/dashboard/VolumeChart";
import TurbidityChart from "../components/dashboard/TurbidityChart";
import ColorChart from "../components/dashboard/ColorChart";
import FlowVisualizer from "../monitoring/FlowVisualizer";
import SensorReadings from "../monitoring/SensorReadings";
import EventLog from "../monitoring/EventLog";
import { Card } from "../components/ui/card";
import {
  connectESP32,
  startReading,
  disconnectESP32,
} from "../utils/bluetooth";

export default function LiveMonitoring() {
  const [isFlowing, setIsFlowing] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState("Disconnected");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [chartData, setChartData] = useState([]);

  const [currentReadings, setCurrentReadings] = useState({
    volume_ml: "0.00",
    flow_rate_mLs: "0.00",
    turbidity_rntu: "0.0",
    color_value: "NA",
    color_code: -1,
    motion_flag: "0",
    status: "IDLE",
  });

  const resetLiveState = () => {
    setIsReading(false);
    setIsFlowing(false);
    setDeviceStatus("Disconnected");
  };

  const fullDisconnect = async () => {
    await disconnectESP32();
    resetLiveState();
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        fullDisconnect();
      }
    };

    window.addEventListener("beforeunload", fullDisconnect);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      fullDisconnect();
      window.removeEventListener("beforeunload", fullDisconnect);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const volume = parseFloat(parsed.volume_ml);
        const flowRate = parseFloat(parsed.flow_rate_mLs);
        const turbidity = parseFloat(parsed.turbidity_rntu);
        const colorCode = parseInt(parsed.color_code, 10);
        const flowFlag = String(parsed.motion_flag) === "1";

        const safeVolume = Number.isFinite(volume) ? volume : 0;
        const safeFlowRate = Number.isFinite(flowRate) ? flowRate : 0;
        const safeTurbidity = Number.isFinite(turbidity) ? turbidity : 0;
        const safeColorCode = Number.isFinite(colorCode) ? colorCode : 0;

        setCurrentReadings({
          volume_ml: safeVolume.toFixed(2),
          flow_rate_mLs: safeFlowRate.toFixed(2),
          turbidity_rntu: safeTurbidity.toFixed(1),
          color_value: parsed.color_value || "NA",
          color_code: safeColorCode,
          motion_flag: parsed.motion_flag || "0",
          status: parsed.status || "UNKNOWN",
        });

        setIsFlowing(flowFlag);
        setDeviceStatus(parsed.status === "OK" ? "Connected" : "Warning");

        setChartData((prev) => [
          ...prev.slice(-59),
          {
            time,
            flowRate: safeFlowRate,
            volume: safeVolume,
            turbidity: safeTurbidity,
            colorCode: safeColorCode,
          },
        ]);
      });
    } catch (error) {
      alert(error.message);
      setDeviceStatus("Read Failed");
      setIsReading(false);
    }
  };

  const handleDisconnect = async () => {
    await fullDisconnect();
    setChartData([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Live Monitoring</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time sensor data — PT-4821 • Device UT-001 • ICU-12
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

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              isFlowing
                ? "bg-success/10 border border-success/20"
                : "bg-muted border border-border"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isFlowing
                  ? "bg-success animate-live-pulse"
                  : "bg-muted-foreground"
              }`}
            />
            <span
              className={`text-sm font-bold ${
                isFlowing ? "text-success" : "text-muted-foreground"
              }`}
            >
              {isFlowing ? "FLOW DETECTED" : "NO FLOW"}
            </span>
          </div>
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
              {currentReadings.turbidity_rntu} rNTU
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Color</p>
            <p className="font-semibold">{currentReadings.color_value}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Motion Flag</p>
            <p className="font-semibold">{currentReadings.motion_flag}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FlowRateChart data={chartData} />
        <VolumeChart data={chartData} />
        <TurbidityChart data={chartData} />
        <ColorChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FlowVisualizer isFlowing={isFlowing} />
        <SensorReadings />
      </div>

      <EventLog />
    </div>
  );
}
