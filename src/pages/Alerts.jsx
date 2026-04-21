import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ALERTS_DATA } from "@/lib/sampleData";
import { AlertTriangle, AlertCircle, Info, Filter } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const severityConfig = {
  critical: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", icon: AlertTriangle, badge: "bg-destructive text-destructive-foreground" },
  high: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20", icon: AlertCircle, badge: "bg-warning text-warning-foreground" },
  medium: { bg: "bg-chart-3/10", text: "text-chart-3", border: "border-chart-3/20", icon: AlertCircle, badge: "bg-chart-3 text-white" },
  low: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border", icon: Info, badge: "bg-muted text-muted-foreground" },
};

export default function Alerts() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? ALERTS_DATA : ALERTS_DATA.filter(a => a.severity === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Alerts & Notifications</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Clinical alert management and response tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex items-center gap-3">
        {["critical", "high", "medium", "low"].map((sev) => {
          const count = ALERTS_DATA.filter(a => a.severity === sev).length;
          const config = severityConfig[sev];
          return (
            <Badge key={sev} className={`${config.badge} text-[10px] px-2 py-0.5 cursor-pointer`} onClick={() => setFilter(sev)}>
              {count} {sev}
            </Badge>
          );
        })}
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <Card key={alert.id} className={`p-5 border ${config.border} ${config.bg} hover:shadow-md transition-shadow`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className={`${config.badge} text-[9px] px-1.5 py-0 uppercase`}>{alert.severity}</Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">{alert.time}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{alert.patient} — {alert.device}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground">{alert.room}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">{alert.message}</p>
                  <div className="mt-2 p-2.5 bg-background/80 rounded-md border border-border/50">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Recommended Action</p>
                    <p className="text-xs text-foreground">{alert.action}</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
