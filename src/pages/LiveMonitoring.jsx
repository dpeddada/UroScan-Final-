import { useState, useEffect, useRef } from "react";
import LiveVolumeChart from "../components/dashboard/LiveVolumeChart";
import FlowStateChart from "../components/dashboard/FlowStateChart";
import TurbidityChart from "../components/dashboard/TurbidityChart";
import FlowVisualizer from "../monitoring/FlowVisualizer";
import SensorReadings from "../monitoring/SensorReadings";
import EventLog from "../components/monitoring/EventLog";
import { Card } from "../components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function ColorTrendChart() {
  const [data, setData] = useState([]);
  const valRef = useRef(1);

  useEffect(() => {
    const initial = [];
    const now = Date.now();
    for (let i = 60; i >= 0; i--) {
      if (Math.random() > 0.9) valRef.current = Math.min(5, Math.max(0, valRef.current + (Math.random() > 0.5 ? 1 : -1)));
      initial.push({
        time: new Date(now - i * 2000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        color: valRef.current,
      });
    }
    setData(initial);
    const interval = setInterval(() => {
      if (Math.random() > 0.85) valRef.current = Math.min(5, Math.max(0, valRef.current + (Math.random() > 0.5 ? 1 : -1)));
      setData(prev => [...prev.slice(-59), {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        color: valRef.current,
      }]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const colors = ["Pale Yellow", "Light Yellow", "Yellow", "Dark Yellow", "Amber", "Dark Amber"];

  return (
    <Card className="p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Urine Color — Trend</h3>
          <p className="text-[11px] text-muted-foreground">RGB sensor classification</p>
        </div>
        <span className="text-xs font-medium text-chart-3">
          {data.length > 0 ? colors[data[data.length - 1].color] : '--'}
        </span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 88%)" />
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'hsl(215 12% 50%)' }} interval={14} />
            <YAxis tick={{ fontSize: 9, fill: 'hsl(215 12% 50%)' }} domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tickFormatter={(v) => colors[v]?.split(' ')[0] || ''} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(210 15% 88%)', background: 'white' }} formatter={(v) => [colors[v], 'Color']} />
            <Line type="stepAfter" dataKey="color" stroke="hsl(45 93% 47%)" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default function LiveMonitoring() {
  const [isFlowing, setIsFlowing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlowing(prev => Math.random() > 0.25 ? prev : !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Live Monitoring</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time sensor data — PT-4821 • Device UT-001 • ICU-12</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isFlowing ? 'bg-success/10 border border-success/20' : 'bg-muted border border-border'}`}>
          <div className={`w-2.5 h-2.5 rounded-full ${isFlowing ? 'bg-success animate-live-pulse' : 'bg-muted-foreground'}`} />
          <span className={`text-sm font-bold ${isFlowing ? 'text-success' : 'text-muted-foreground'}`}>
            {isFlowing ? 'FLOW DETECTED' : 'NO FLOW'}
          </span>
        </div>
      </div>

      {/* Top: Visualizer + Sensor Readings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FlowVisualizer isFlowing={isFlowing} />
        <SensorReadings />
      </div>

      {/* Live Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LiveVolumeChart />
        <FlowStateChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TurbidityChart />
        <ColorTrendChart />
      </div>

      {/* Event Log */}
      <EventLog />
    </div>
  );
}
