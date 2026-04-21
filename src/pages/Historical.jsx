import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const hourlyVolume = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  volume: Math.round(40 + Math.random() * 120),
  events: Math.floor(1 + Math.random() * 5),
}));

const shiftData = [
  { shift: "Night (00–08)", volume: 680, events: 14, avgTurbidity: 89, color: "Light Yellow" },
  { shift: "Day (08–16)", volume: 920, events: 22, avgTurbidity: 85, color: "Yellow" },
  { shift: "Evening (16–24)", volume: 540, events: 11, avgTurbidity: 91, color: "Pale Yellow" },
];

const dailyTotals = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return {
    day: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    volume: Math.round(1600 + Math.random() * 800),
    average: 2000,
  };
});

const eventLog = [
  { time: "14:32", event: "Flow started", detail: "Duration: 12 min, Volume: 142 mL" },
  { time: "13:45", event: "Turbidity change", detail: "Clarity dropped from 92% to 78%" },
  { time: "12:18", event: "Color shift", detail: "Changed from Pale Yellow to Yellow" },
  { time: "11:00", event: "Bag emptied", detail: "Volume reset after 1,640 mL drained" },
  { time: "09:22", event: "Flow started", detail: "Duration: 8 min, Volume: 96 mL" },
  { time: "07:45", event: "Shift handoff", detail: "Night to Day shift — 680 mL total" },
  { time: "05:10", event: "Alert: Low output", detail: "No flow for 3+ hours" },
  { time: "02:30", event: "Flow started", detail: "Duration: 5 min, Volume: 48 mL" },
];

export default function Historical() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Historical Trends</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Urine output patterns and trend analysis — PT-4821</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="7d">
            <SelectTrigger className="h-8 text-xs w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Hourly volume */}
      <Card className="p-5 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-1">Hourly Volume Output (Today)</h3>
        <p className="text-[11px] text-muted-foreground mb-4">mL per hour with flow event count</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 88%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'hsl(215 12% 50%)' }} interval={2} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(215 12% 50%)' }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(210 15% 88%)' }} />
              <Bar dataKey="volume" fill="hsl(210 70% 45%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Daily totals line chart */}
      <Card className="p-5 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-1">Daily Total Volume — 7 Day Trend</h3>
        <p className="text-[11px] text-muted-foreground mb-4">Compared to daily average target</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyTotals}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 88%)" />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(215 12% 50%)' }} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(215 12% 50%)' }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(210 15% 88%)' }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="volume" stroke="hsl(210 70% 45%)" strokeWidth={2} dot={{ r: 3 }} name="Actual" />
              <Line type="monotone" dataKey="average" stroke="hsl(210 15% 88%)" strokeDasharray="5 5" strokeWidth={1.5} dot={false} name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Shift summary */}
        <Card className="border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Shift-Based Summary</h3>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Shift</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Volume</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Events</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Avg Clarity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shiftData.map((s) => (
                <tr key={s.shift} className="hover:bg-muted/30">
                  <td className="px-4 py-2.5 font-medium text-foreground">{s.shift}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{s.volume} mL</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{s.events}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{s.avgTurbidity}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Event Log */}
        <Card className="border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Event Timeline</h3>
          </div>
          <div className="divide-y divide-border max-h-72 overflow-y-auto">
            {eventLog.map((ev, i) => (
              <div key={i} className="px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono text-muted-foreground">{ev.time}</span>
                  <span className="text-xs font-semibold text-foreground">{ev.event}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{ev.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Nursing notes */}
      <Card className="p-5 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Nursing Notes & Comments</h3>
        <div className="space-y-2">
          {[
            { time: "14:00", nurse: "RN Sarah M.", note: "Patient well hydrated, urine output consistent. No concerns." },
            { time: "08:00", nurse: "RN David K.", note: "Overnight output slightly low — will monitor and increase IV rate if needed." },
            { time: "22:00", nurse: "RN Lisa T.", note: "Bag emptied at shift start. Color and clarity normal." },
          ].map((n, i) => (
            <div key={i} className="p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-muted-foreground">{n.time}</span>
                <span className="text-xs font-semibold text-foreground">{n.nurse}</span>
              </div>
              <p className="text-xs text-muted-foreground">{n.note}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
