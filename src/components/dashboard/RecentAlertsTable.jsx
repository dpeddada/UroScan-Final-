import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ALERTS_DATA } from "@/lib/sampleData";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const severityConfig = {
  critical: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", icon: AlertTriangle },
  high: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20", icon: AlertCircle },
  medium: { bg: "bg-chart-3/10", text: "text-chart-3", border: "border-chart-3/20", icon: AlertCircle },
  low: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border", icon: Info },
};

export default function RecentAlertsTable() {
  return (
    <Card className="border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Recent Alerts</h3>
        <Badge variant="outline" className="text-[10px]">{ALERTS_DATA.length} total</Badge>
      </div>
      <div className="divide-y divide-border max-h-80 overflow-y-auto">
        {ALERTS_DATA.slice(0, 5).map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <div key={alert.id} className="p-3 flex items-start gap-3 hover:bg-muted/30 transition-colors">
              <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className={`w-3.5 h-3.5 ${config.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge className={`${config.bg} ${config.text} border ${config.border} text-[9px] px-1.5 py-0`}>
                    {alert.severity}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                  <span className="text-[10px] text-muted-foreground">• {alert.device}</span>
                </div>
                <p className="text-xs text-foreground font-medium truncate">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
