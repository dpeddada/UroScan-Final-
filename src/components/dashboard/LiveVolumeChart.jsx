import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Activity } from "lucide-react";

export default function LiveVolumeChart() {
  const [data, setData] = useState([]);
  const valueRef = useRef(30);

  useEffect(() => {
    // Initialize with 60 points
    const initial = [];
    const now = Date.now();
    for (let i = 60; i >= 0; i--) {
      valueRef.current = Math.max(5, valueRef.current + (Math.random() - 0.45) * 8);
      initial.push({
        time: new Date(now - i * 2000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        volume: Math.round(valueRef.current * 10) / 10,
      });
    }
    setData(initial);

    const interval = setInterval(() => {
      valueRef.current = Math.max(5, valueRef.current + (Math.random() - 0.45) * 8);
      const newPoint = {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        volume: Math.round(valueRef.current * 10) / 10,
      };
      setData(prev => [...prev.slice(-59), newPoint]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Urine Volume — Real Time</h3>
          <p className="text-[11px] text-muted-foreground">mL/min flow rate (last 2 minutes)</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-live-pulse" />
          <span className="text-[10px] font-semibold text-success">STREAMING</span>
        </div>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 88%)" />
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'hsl(215 12% 50%)' }} interval={14} />
            <YAxis tick={{ fontSize: 9, fill: 'hsl(215 12% 50%)' }} domain={[0, 'auto']} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(210 15% 88%)', background: 'white' }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="hsl(210 70% 45%)"
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
