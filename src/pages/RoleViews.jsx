import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Stethoscope, UserCheck, Wrench, Building2, Activity, AlertTriangle, Gauge, TrendingUp, Cpu, Wifi, BarChart3, Users } from "lucide-react";

function NurseView() {
  return (
    <div className="space-y-4">
      <Card className="p-5 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-3">Current Patient Summary — Quick View</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Flow Status", value: "Active", color: "text-success" },
            { label: "Current Volume", value: "1,847 mL", color: "text-chart-1" },
            { label: "Bag Status", value: "64% Full", color: "text-chart-3" },
            { label: "Active Alerts", value: "1", color: "text-destructive" },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-muted/30 rounded-lg">
              <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
              <p className={`text-lg font-bold ${item.color} mt-0.5`}>{item.value}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-2">Alert Visibility</h3>
        <p className="text-xs text-muted-foreground mb-3">Prioritized alerts for immediate nursing action</p>
        <div className="space-y-2">
          <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
            <span className="text-xs text-foreground">No flow detected for 4+ hours — PT-4821</span>
          </div>
          <div className="p-3 bg-chart-3/5 rounded-lg border border-chart-3/20 flex items-center gap-3">
            <Gauge className="w-4 h-4 text-chart-3 shrink-0" />
            <span className="text-xs text-foreground">Bag at 92% capacity — PT-6201 — action required</span>
          </div>
        </div>
      </Card>
      <Card className="p-5 border border-border bg-success/[0.02]">
        <h3 className="text-sm font-bold text-foreground mb-1">Reduced Manual Charting</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">UroTrack auto-records volume, flow events, and sensor readings — eliminating the need for manual urine output documentation every 1-4 hours.</p>
      </Card>
    </div>
  );
}

function ClinicianView() {
  return (
    <div className="space-y-4">
      <Card className="p-5 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-3">Trends & Pattern Analysis</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "24h Output Trend", value: "↑ Increasing", desc: "2,140 mL total — above baseline" },
            { label: "Oliguria Risk", value: "Low", desc: "Output > 0.5 mL/kg/hr sustained" },
            { label: "Turbidity Pattern", value: "Stable", desc: "Clarity index 85–92% over 12h" },
            { label: "Color Variation", value: "Mild shift", desc: "Pale Yellow → Yellow post-medication" },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-muted/30 rounded-lg">
              <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
              <p className="text-sm font-bold text-foreground mt-0.5">{item.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-2">Recent Abnormalities</h3>
        <div className="space-y-2">
          {["Rapid output increase — 280 mL in 30 min (14:18)", "Turbidity drop below threshold (13:45)", "Color shifted to dark amber (13:22)"].map((item, i) => (
            <div key={i} className="p-2.5 bg-muted/30 rounded-md text-xs text-foreground flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-chart-1 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function EngineerView() {
  return (
    <div className="space-y-4">
      <Card className="p-5 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-3">Sensor Health Overview</h3>
        <div className="space-y-2">
          {[
            { name: "Weight Sensor (Load Cell)", signal: 98, cal: "2026-04-15", status: "OK" },
            { name: "Motion Sensor (Accelerometer)", signal: 95, cal: "2026-04-14", status: "OK" },
            { name: "Turbidity Sensor (Optical)", signal: 92, cal: "2026-04-13", status: "OK" },
            { name: "Color Sensor (RGB)", signal: 97, cal: "2026-04-15", status: "OK" },
          ].map((s) => (
            <div key={s.name} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-chart-2" />
                <span className="text-xs font-medium text-foreground">{s.name}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span>Signal: <strong className="text-foreground">{s.signal}%</strong></span>
                <span>Cal: {s.cal}</span>
                <Badge className="bg-success/10 text-success border border-success/20 text-[9px] px-1.5 py-0">{s.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-3">Troubleshooting Panel</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground font-medium mb-1">Device Firmware</p>
            <p className="font-mono text-foreground">v2.4.1 (latest)</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground font-medium mb-1">Connection Protocol</p>
            <p className="font-mono text-foreground">BLE 5.0 + Wi-Fi</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground font-medium mb-1">Raw ADC Noise Floor</p>
            <p className="font-mono text-foreground">±0.3 mV (acceptable)</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground font-medium mb-1">Sampling Rate</p>
            <p className="font-mono text-foreground">10 Hz (all sensors)</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function LeadershipView() {
  return (
    <div className="space-y-4">
      <Card className="p-5 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-3">Unit Device Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Active Devices", value: "5 / 6" },
            { label: "Total Alerts Today", value: "12" },
            { label: "Avg Alert Response", value: "4.2 min" },
            { label: "Device Utilization", value: "83%" },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-muted/30 rounded-lg text-center">
              <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
              <p className="text-xl font-bold text-primary mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-2">Workflow Impact Summary</h3>
        <p className="text-xs text-muted-foreground mb-3">Estimated time savings and operational benefits from UroTrack deployment</p>
        <div className="space-y-2 text-xs">
          {[
            "Eliminated ~75% of manual urine output charting tasks",
            "Reduced average alert response time from hours to minutes",
            "Captured 10x more data points per patient per day",
            "Zero missed measurements on monitored patients",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-success/5 rounded-md">
              <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function RoleViews() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Role-Based Views</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Tailored dashboard perspectives for different user roles</p>
      </div>

      <Tabs defaultValue="nurse" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="nurse" className="text-xs gap-1.5"><Stethoscope className="w-3.5 h-3.5" /> Nurse</TabsTrigger>
          <TabsTrigger value="clinician" className="text-xs gap-1.5"><UserCheck className="w-3.5 h-3.5" /> Clinician</TabsTrigger>
          <TabsTrigger value="engineer" className="text-xs gap-1.5"><Wrench className="w-3.5 h-3.5" /> Biomed Engineer</TabsTrigger>
          <TabsTrigger value="leadership" className="text-xs gap-1.5"><Building2 className="w-3.5 h-3.5" /> Leadership</TabsTrigger>
        </TabsList>
        <TabsContent value="nurse"><NurseView /></TabsContent>
        <TabsContent value="clinician"><ClinicianView /></TabsContent>
        <TabsContent value="engineer"><EngineerView /></TabsContent>
        <TabsContent value="leadership"><LeadershipView /></TabsContent>
      </Tabs>
    </div>
  );
}
