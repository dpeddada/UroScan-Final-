import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function TurbidityChart() {
  const [data, setData] = useState([]);
  const valueRef = useRef(88);

  useEffect(() => {
    const initial = [];
    const now = Date.now();
    for (let i = 60; i >= 0; i--) {
      valueRef.current = Math.max(40, Math.min(100, valueRef.current + (Math.random() - 0.5) * 5));
      initial.push({
        time: new Date(now - i * 2000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        clarity: Math.round(valueRef.current * 10) / 10,
      });
    }
    setData(initial);

    const interval = setInterval(() => {
      valueRef.current = Math.max(40, Math.min(100, valueRef.current + (Math.random() - 0.5) * 5));
      setData(prev => [...prev.slice(-59), {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        clarity: Math.round(valueRef.current * 10) / 10,
      }]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Turbidity — Clarity Index</h3>
          <p className="text-[11px] text-muted-foreground">Optical transmittance (higher = clearer)</p>
 
