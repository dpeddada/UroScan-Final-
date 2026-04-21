import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Droplets } from "lucide-react";

export default function FlowVisualizer({ isFlowing }) {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    if (!isFlowing) {
      setDrops([]);
      return;
    }
    const interval = setInterval(() => {
      setDrops(prev => {
        const next = [...prev, { id: Date.now(), x: 45 + Math.random() * 10 }];
        return next.slice(-8);
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isFlowing]);

  return (
    <Card className="border border-border p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Device Flow Visualization</h3>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isFlowing ? 'bg-success/10' : 'bg-muted'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isFlowing ? 'bg-success animate-live-pulse' : 'bg-muted-foreground'}`} />
          <span className={`text-[10px] font-semibold ${isFlowing ? 'text-success' : 'text-muted-foreground'}`}>
            {isFlowing ? 'FLOW ACTIVE' : 'NO FLOW'}
          </span>
        </div>
      </div>

      {/* Simple flow diagram */}
      <div className="relative h-48 bg-muted/30 rounded-lg border border-border overflow-hidden">
        {/* Catheter/tubing path */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Patient Catheter
        </div>

        {/* Vertical tube */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-6 h-20 border-2 border-border rounded-b-lg bg-card">
          {isFlowing && <div className="w-full h-full rounded-b-lg animate-flow" />}
        </div>

        {/* Sensor zone */}
        <div className="absolute top-[72px] left-1/2 -translate-x-1/2 w-16 h-8 border-2 border-chart-2 rounded-md bg-chart-2/5 flex items-center justify-center z-10">
          <span className="text-[8px] font-bold text-chart-2 uppercase">Sensors</span>
        </div>

        {/* Collection indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-14 border-2 border-chart-1/40 rounded-lg bg-chart-1/5 flex flex-col items-center justify-center">
          <Droplets className="w-4 h-4 text-chart-1/60 mb-0.5" />
          <span className="text-[8px] font-semibold text-chart-1/80">Collection Bag</span>
        </div>

        {/* Animated drops */}
        {isFlowing && drops.map((drop) => (
          <div
            key={drop.id}
            className="absolute w-1.5 h-2.5 bg-chart-2/60 rounded-full"
            style={{
              left: `${drop.x}%`,
              top: '32px',
              animation: 'flowDrop 1.2s ease-in forwards',
            }}
          />
        ))}

        {/* Side labels */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 space-y-1.5 text-[8px] text-muted-foreground">
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-chart-1" /> Weight</div>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-chart-2" /> Motion</div>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-chart-3" /> Turbidity</div>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-chart-5" /> Color</div>
        </div>
      </div>

      <style>{`
        @keyframes flowDrop {
          0% { top: 32px; opacity: 1; }
          100% { top: 140px; opacity: 0; }
        }
      `}</style>
    </Card>
  );
}
