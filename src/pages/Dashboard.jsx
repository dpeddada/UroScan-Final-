import SummaryCards from "@/components/dashboard/SummaryCards";
import LiveVolumeChart from "@/components/dashboard/LiveVolumeChart";
import FlowStateChart from "@/components/dashboard/FlowStateChart";
import TurbidityChart from "@/components/dashboard/TurbidityChart";
import RecentAlertsTable from "@/components/dashboard/RecentAlertsTable";
import PatientDeviceTable from "@/components/dashboard/PatientDeviceTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">ICU Unit A — Active device monitoring overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="pt-4821">
            <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Patient" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-4821">PT-4821 • ICU-12</SelectItem>
              <SelectItem value="pt-3907">PT-3907 • ICU-08</SelectItem>
              <SelectItem value="pt-5134">PT-5134 • STEP-03</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="shift">
            <SelectTrigger className="h-8 text-xs w-28"><SelectValue placeholder="View" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="shift">Current Shift</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="48h">Last 48h</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary cards */}
      <SummaryCards />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LiveVolumeChart />
        <FlowStateChart />
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TurbidityChart />
        <RecentAlertsTable />
        <PatientDeviceTable />
      </div>
    </div>
  );
}
