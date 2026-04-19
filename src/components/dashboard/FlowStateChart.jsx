import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function FlowStateChart() {
  const [data, setData] = useState([]);
  const flowRef = useRef(true);
  const counterRef = useRef(0);

  useEffect(() => {
    const initial = [];
    const now = Date.now();
    for (let i = 60; i >= 0; i--) {
      counterRef.current++;
      if (counterRef.current > 5 + Math.random() * 12) {
        flowRef.current = !flowRef.current;
        counterRef.current = 0;
      }
      initial.push({
        time: new Date(now - i * 2000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        flow: flowRef.current ? 1 : 0,
      });
    }
    setData(initial);

    const interval = setInterval(() => {
      counterRef.current++;
      if (counterRef.current > 5 + Math.random() * 12) {
        flowRef.current = !flowRef.current;
        counterRef.current = 0;
      }
      setData(prev => [...prev.slice(-59), {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        flow: flowRef.current ? 1 : 0,
      }]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentFlow = data.length > 0 ? data[data.length - 1].flow : 0;

  return (
    <Card className="p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Flow State — Live</h3>
          <p className="text-[11px] text-muted-foreground">Motion sensor ON/OFF detection</p>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${currentFlow ? 'bg-success/10' : 'bg-muted'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${currentFlow ? 'bg-success animate-live-pulse' : 'bg-muted-foreground'}`} />
          <span className={`text-[10px] font-semibold ${currentFlow ? 'text-success' : 'text-muted-foreground'}`}>
            {currentFlow ? 'FLOW DETECTED' : 'NO FLOW'}
          </span>
        </div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 88%)" />
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'hsl(215 12% 50%)' }} interval={14} />
            <YAxis tick={{ fontSize: 9, fill: 'hsl(215 12% 50%)' }} domain={[0, 1]} ticks={[0, 1]} tickFormatter={(v) => v ? 'ON' : 'OFF'} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(210 15% 88%)', background: 'white' }}
              formatter={(value) => [value ? 'Flow Detected' : 'No Flow', 'State']}
            />
            <Area
              type="stepAfter"
              dataKey="flow"
              stroke="hsl(175 55% 42%)"
              fill="hsl(175 55% 42% / 0.15)"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
