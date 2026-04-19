import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const EVENT_TYPES = [
  { msg: "Flow started — motion sensor triggered", type: "flow" },
  { msg: "Flow stopped — no motion detected", type: "noflow" },
  { msg: "Volume increment: +18 mL", type: "volume" },
  { msg: "Turbidity stable at 91%", type: "turbidity" },
  { msg: "Color reading: Light Yellow", type: "color" },
  { msg: "Volume increment: +24 mL", type: "volume" },
  { msg: "Flow resumed after 3 min pause", type: "flow" },
  { msg: "Turbidity slight decrease — 86%", type: "turbidity" },
];

const typeColors = {
  flow: "bg-success",
  noflow: "bg-warning",
  volume: "bg-chart-1",
  turbidity: "bg-chart-2",
  color: "bg-chart-5",
};

export default function EventLog() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Seed initial events
    const initial = [];
    const now = Date.now();
    for (let i = 8; i >= 0; i--) {
      const ev = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
      initial.push({
        id: now - i * 10000,
        time: new Date(now - i * 10000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ...ev,
      });
    }
    setEvents(initial);

    const interval = setInterval(() => {
      const ev = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
      const now = Date.now();
      setEvents(prev => [
        { id: now, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), ...ev },
        ...prev.slice(0, 14),
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Event Log — Live</h3>
        <span className="text-[10px] text-muted-foreground font-mono">{events.length} events</span>
      </div>
      <div className="space-y-1.5 max-h-80 overflow-y-auto">
        {events.map((ev, i) => (
          <div key={ev.id} className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md ${i === 0 ? 'bg-muted/50' : ''} transition-colors`}>
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${typeColors[ev.type]}`} />
            <span className="text-[10px] text-muted-foreground font-mono shrink-0">{ev.time}</span>
            <span className="text-xs text-foreground truncate">{ev.msg}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
