import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PATIENTS } from "@/lib/sampleData";

const statusStyles = {
  active: "bg-success/10 text-success border-success/20",
  alert: "bg-destructive/10 text-destructive border-destructive/20",
  inactive: "bg-muted text-muted-foreground border-border",
};

export default function PatientDeviceTable() {
  return (
    <Card className="border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Device — Patient Summary</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Patient ID</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Room</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Device</th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PATIENTS.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 font-mono font-medium text-foreground">{p.id}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{p.room}</td>
                <td className="px-4 py-2.5 font-mono text-muted-foreground">{p.device}</td>
                <td className="px-4 py-2.5">
                  <Badge className={`${statusStyles[p.status]} border text-[9px] px-1.5 py-0`}>
                    {p.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
