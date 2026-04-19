import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Scale, Activity, Eye, Palette } from "lucide-react";

const sensorConfig = [
  { key: "weight", label: "Weight Sensor", unit: "mL", icon: Scale, color: "text-chart-1", bg: "bg-chart-1/10", getVal: () => Math.round(1700 + Math.random() * 300) },
  { key: "motion", label: "Motion Sensor", unit: "", icon: Activity, color: "text-chart-2", bg: "bg-chart-2/10", getVal: () => (Math.random() > 0.3 ? "Flow" : "No Flow") },
  { key: "turbidity", label: "Turbidity", unit: "%", icon: Eye, color: "text-chart-3", bg: "bg-chart-3/10", getVal: () => Math.round(75 + Math.random() * 25) },
  { key: "color", label: "Color Sensor", unit: "", icon: Palette, color: "text-chart-5", bg: "bg-chart-5/10", getVal: () => ["Pale Yellow", "Light Yellow", "Yellow", "Dark Yellow"][Math.floor(Math.random() * 4)] },
];

export default function SensorReadings() {
  const [readings, setReadings] = useState({});

  useEffect(() => {
    const update = () => {
      const r = {};
      sensorConfig.forEach((s) => { r[s.key] = s.getVal(); });
      setReadings(r);
    };
    update();
    const interval = setInterval(update, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Live Sensor Readings</h3>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-live-pulse" />
          <span className="text-[10px] font-semibold text-success">LIVE</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {sensorConfig.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <div key={sensor.key} className={`${sensor.bg} rounded-xl p-4 border border-transparent`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${sensor.color}`} />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{sensor.label}</span>
              </div>
              <p className="text-xl font-bold text-foreground">
                {readings[sensor.key] ?? '--'}<span className="text-xs font-normal text-muted-foreground ml-1">{sensor.unit}</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Updated {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
