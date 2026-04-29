import { useEffect, useState } from "react";
import FlowRateChart from "../components/dashboard/FlowRateChart";
import VolumeChart from "../components/dashboard/VolumeChart";
import TurbidityChart from "../components/dashboard/TurbidityChart";
import ColorChart from "../components/dashboard/ColorChart";
import FlowVisualizer from "../monitoring/FlowVisualizer";
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
  const [isDemoMode, setIsDemoMode] = useState(false);
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
    setIsDemoMode(false);
    setDeviceStatus("Disconnected");
  };

  const fullDisconnect = async () => {
    await disconnectESP32();
    resetLiveState();
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) fullDisconnect();
    };

    window.addEventListener("beforeunload", fullDisconnect);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      fullDisconnect();
      window.removeEventListener("beforeunload", fullDisconnect);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!isDemoMode) return;

    const addDemoPoint = () => {
      const time = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const flowRate = 2.5 + (Math.random() - 0.5) * 1.8;
      const peakFlowRate = flowRate + 0.8 + Math.random() * 1.4;
      const turbidity = 45 + (Math.random() - 0.5) * 35;
      const colorCode = Math.floor(Math.random() * 6);

      setChartData((prev) => {
        const lastVolume = prev.length > 0 ? prev[prev.length - 1].volume : 0;
        const volume = lastVolume + flowRate * 20 + Math.random() * 20;

        const point = {
          lineType: "DATA",
          time,
          flowRate,
          peakFlowRate,
          volume,
          turbidity,
          colorCode,
        };

        const spectralPoint = {
          lineType: "SPECTRAL",
          time,
          F1_405: 45 + Math.random() * 30,
          F2_425: 82 + Math.random() * 40,
          FZ_450: 156 + Math.random() * 80,
          F3_475: 61 + Math.random() * 40,
          F4_515: 123 + Math.random() * 60,
          F5_550: 49 + Math.random() * 30,
          FY_555: 160 + Math.random() * 80,
          FXL_600: 115 + Math.random() * 50,
          F6_640: 62 + Math.random() * 35,
          F7_690: 25 + Math.random() * 20,
          F8_745: 3 + Math.random() * 8,
          NIR_855: 3 + Math.random() * 8,
          YI: 1.026,
          RI: 0.504,
        };

        setCurrentReadings({
          volume_ml: volume.toFixed(2),
          flow_rate_mLs: flowRate.toFixed(2),
          turbidity_rntu: turbidity.toFixed(1),
          color_value: "Demo",
          color_code: colorCode,
          motion_flag: "1",
          status: "DEMO",
        });

        return [...prev.slice(-58), point, spectralPoint];
      });

      setIsFlowing(true);
      setDeviceStatus("Demo Mode");
    };

    addDemoPoint();
    const interval = setInterval(addDemoPoint, 20000);

    return () => clearInterval(interval);
  }, [isDemoMode]);

  const handleConnect = async () => {
    try {
      setIsDemoMode(false);
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

  const handleUseDemoData = () => {
    setChartData([]);
    setIsDemoMode(true);
    setIsReading(false);
    setIsFlowing(true);
    setDeviceStatus("Demo Mode");
  };

  const handleStartReading = async () => {
    try {
      setIsDemoMode(false);
      setIsReading(true);

      await startReading((parsed) => {
        const time = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        if (parsed.lineType === "SPECTRAL") {
          setChartData((prev) => [
            ...prev.slice(-59),
            {
              lineType: "SPECTRAL",
              time,
              F1_405: Number(parsed.F1_405 || 0),
              F2_425: Number(parsed.F2_425 || 0),
              FZ_450: Number(parsed.FZ_450 || 0),
              F3_475: Number(parsed.F3_475 || 0),
              F4_515: Number(parsed.F4_515 || 0),
              F5_550: Number(parsed.F5_550 || 0),
              FY_555: Number(parsed.FY_555 || 0),
              FXL_600: Number(parsed.FXL_600 || 0),
              F6_640: Number(parsed.F6_640 || 0),
              F7_690: Number(parsed.F7_690 || 0),
              F8_745: Number(parsed.F8_745 || 0),
              NIR_855: Number(parsed.NIR_855 || 0),
              YI: Number(parsed.YI || 0),
              RI: Number(parsed.RI || 0),
            },
          ]);

          return;
        }

        const volume = parseFloat(parsed.volume_ml);
        const flowRate = parseFloat(parsed.flow_rate_mLs);
        const turbidity = parseFloat(parsed.turbidity_rntu);
        const colorCode = parseInt(parsed.color_code, 10);
        const flowFlag = String(parsed.motion_flag) === "1";

        const safeVolume = Number.isFinite(volume) ? volume : 0;
        const safeFlowRate = Number.isFinite(flowRate) ? flowRate : 0;
        const safePeakFlowRate = safeFlowRate * 1.25;
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
            lineType: "DATA",
            time,
            flowRate: safeFlowRate,
            peakFlowRate: safePeakFlowRate,
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
            onClick={handleUseDemoData}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium"
          >
            Use Demo Data
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

      <div className="grid grid-cols-1 gap-4">
        <FlowVisualizer isFlowing={isFlowing} />
      </div>

      <EventLog />
    </div>
  );
}
