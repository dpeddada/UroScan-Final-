import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Battery, Clock, Signal, Database, AlertTriangle, CheckCircle, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const devices = [
  { id: "UT-001", room: "ICU-12", patient: "PT-4821", connected: true, signal: 98, battery: 87, uptime: "6d 14h", lastSync: "12s ago", dataComplete: 99.2, needsCal: false },
  { id: "UT-002", room: "ICU-08", patient: "PT-3907", connected: true, signal: 95, battery: 72, uptime: "4d 08h", lastSync: "8s ago", dataComplete: 98.7, needsCal: false },
  { id: "UT-003", room: "STEP-03", patient: "PT-5134", connected: true, signal: 92, battery: 64, uptime: "2d 20h", lastSync: "15s ago", dataComplete: 97.4, needsCal: true },
  { id: "UT-004", room: "ICU-15", patient: "PT-2789", connected: true, signal: 89, battery: 91, uptime: "5d 02h", lastSync: "5s ago", dataComplete: 99.8, needsCal: false },
  { id: "UT-005", room: "STEP-07", patient: "PT-6201", connected: true, signal: 93, battery: 58, uptime: "3d 11h", lastSync: "22s ago", dataComplete: 96.1, needsCal: false },
  { id: "UT-006", room: "ICU-03", patient: "PT-1456", connected: false, signal: 0, battery: 12, uptime: "0d 00h", lastSync: "48m ago", dataComplete: 72.3, needsCal: true },
];

export default function DeviceHealth() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Device & Data Health</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Platform connectivity, signal quality, and maintenance status</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Connected", value: "5 / 6", icon: Wifi, color: "text-success" },
          { label: "Avg Signal", value: "93%", icon: Signal, color: "text-chart-1" },
          { label: "Data Complete", value: "93.9%", icon: Database, color: "text-chart-2" },
          { label: "Needs Attention", value: "2", icon: AlertTriangle, color: "text-warning" },
        ].map((item) => (
          <Card key={item.label} className="p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
          </Card>
        ))}
      </div>

      {/* Device cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((d) => (
          <Card key={d.id} className={`p-5 border ${d.connected ? 'border-border' : 'border-destructive/30 bg-destructive/[0.02]'}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground font-mono">{d.id}</h3>
                  <Badge className={`text-[9px] px-1.5 py-0 ${d.connected ? 'bg-success/10 text-success border border-success/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                    {d.connected ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{d.room} — {d.patient}</p>
              </div>
              {d.needsCal && (
                <div className="flex items-center gap-1 text-warning">
                  <Settings className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-semibold">CAL DUE</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5"><Signal className="w-3 h-3" /> Signal</span>
                <span className="font-mono font-medium text-foreground">{d.signal}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5"><Battery className="w-3 h-3" /> Battery</span>
                <div className="flex items-center gap-2">
                  <Progress value={d.battery} className="w-16 h-1.5" />
                  <span className="font-mono font-medium text-foreground">{d.battery}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3" /> Last Sync</span>
                <span className="font-mono font-medium text-foreground">{d.lastSync}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5"><Database className="w-3 h-3" /> Data Complete</span>
                <span className={`font-mono font-medium ${d.dataComplete > 95 ? 'text-foreground' : 'text-destructive'}`}>{d.dataComplete}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3" /> Uptime</span>
                <span className="font-mono font-medium text-foreground">{d.uptime}</span>
              </div>
            </div>

            {!d.connected && (
              <div className="mt-3 p-2 bg-destructive/5 rounded-md text-[10px] text-destructive flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                Device offline — check power and connectivity
              </div>
            )}
            {d.dataComplete < 95 && d.connected && (
              <div className="mt-3 p-2 bg-warning/5 rounded-md text-[10px] text-warning flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                Missing data detected — review sync logs
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
