import { useState } from "react";
import LiveVolumeChart from "../components/dashboard/LiveVolumeChart";
import FlowStateChart from "../components/dashboard/FlowStateChart";
import TurbidityChart from "../components/dashboard/TurbidityChart";
import FlowVisualizer from "../monitoring/FlowVisualizer";
import SensorReadings from "../monitoring/SensorReadings";
import EventLog from "../monitoring/EventLog";
import { Card } from "../components/ui/card";
import { connectESP32, startReading } from "../utils/bluetooth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ColorTrendChart({ data = [] }) {
  const colorLabels = [
    "Clear",
    "Very Light Yellow",
    "Light Yellow",
    "Yellow",
    "Dark Yellow",
    "Orange",
    "Red-Orange",
    "Red",
  ];

  const currentColorCode =
    data.length > 0 ? data[data.length - 1].color : null;

  return (
    <Card className="p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Urine Color — Trend
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Device color classification
          </p>
        </div>
        <span className="text-xs font-medium text-chart-3">
          {currentColorCode !== null && colorLabels[currentColorCode]
            ? colorLabels[currentColorCode]
            : "--"}
        </span>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(210 15% 88%)"
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: "hsl(215 12% 50%)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(215 12% 50%)" }}
              domain={[0, 7]}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
              tickFormatter={(v) =>
                colorLabels[v] ? colorLabels[v].split(" ")[0] : ""
              }
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                borderRadius: 8,
                border: "1px solid hsl(210 15% 88%)",
                background: "white",
              }}
              formatter={(value) => [colorLabels[value] || value, "Color"]}
            />
            <Line
              type="stepAfter"
              dataKey="color"
              stroke="hsl(45 93% 47%)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default function LiveMonitoring() {
  const [isFlowing, setIsFlowing] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState("Disconnected");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const [volumeHistory, setVolumeHistory] = useState([]);
  const [flowHistory, setFlowHistory] = useState([]);
  const [turbidityHistory, setTurbidityHistory] = useState([]);
  const [colorHistory, setColorHistory] = useState([]);

  const [currentReadings, setCurrentReadings] = useState({
    volume_ml: "0.00",
    flow_rate_mLs: "0.00",
    turbidity_rntu: "0.0",
    color_value: "NA",
    color_code: -1,
    motion_flag: "0",
    status: "IDLE",
  });

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setDeviceStatus("Connecting...");
      await connectESP32();
      setDeviceStatus("Connected");
    } catch (error) {
      console.error(error);
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
        const flowFlag = parsed.motion_flag === "1";

        setCurrentReadings({
          volume_ml: Number.isFinite(volume) ? volume.toFixed(2) : "0.00",
          flow_rate_mLs: Number.isFinite(flowRate)
            ? flowRate.toFixed(2)
            : "0.00",
          turbidity_rntu: Number.isFinite(turbidity)
            ? turbidity.toFixed(1)
            : "0.0",
          color_value: parsed.color_value || "NA",
          color_code: Number.isFinite(colorCode) ? colorCode : -1,
          motion_flag: parsed.motion_flag || "0",
          status: parsed.status || "UNKNOWN",
        });

        setIsFlowing(flowFlag);
        setDeviceStatus(parsed.status === "OK" ? "Connected" : "Warning");

        if (Number.isFinite(volume)) {
          setVolumeHistory((prev) => [...prev.slice(-59), { time, volume }]);
        }

        setFlowHistory((prev) => [
          ...prev.slice(-59),
          { time, flow: flowFlag ? 1 : 0 },
        ]);

        if (Number.isFinite(turbidity)) {
          setTurbidityHistory((prev) => [
            ...prev.slice(-59),
            { time, turbidity },
          ]);
        }

        if (Number.isFinite(colorCode)) {
          setColorHistory((prev) => [
            ...prev.slice(-59),
            { time, color: colorCode },
          ]);
        }
      });
    } catch (error) {
      console.error(error);
      alert(error.message);
      setDeviceStatus("Read Failed");
      setIsReading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Live Monitoring
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time sensor data — PT-4821 • Device UT-001 • ICU-12
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isConnecting ? "Connecting..." : "Connect ESP32"}
          </button>

          <button
            onClick={handleStartReading}
            disabled={deviceStatus !== "Connected" && deviceStatus !== "Warning"}
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isReading ? "Reading..." : "Start Reading"}
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
        <FlowVisualizer isFlowing={isFlowing} />
        <SensorReadings />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LiveVolumeChart data={volumeHistory} />
        <FlowStateChart data={flowHistory} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TurbidityChart data={turbidityHistory} />
        <ColorTrendChart data={colorHistory} />
      </div>

      <EventLog />
    </div>
  );
}
