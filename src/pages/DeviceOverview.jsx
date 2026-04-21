import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEVICE_SENSORS } from "@/lib/sampleData";
import { Scale, Activity, Eye, Palette, ArrowRight, Monitor, Cpu, Wifi, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const sensorIcons = { "Weight Sensor": Scale, "Motion Sensor": Activity, "Turbidity Sensor": Eye, "Color Sensor": Palette };

const processSteps = [
  { icon: Monitor, label: "Urine passes through tubing", desc: "Patient catheter directs urine through the UroTrack inline sensor module" },
  { icon: Cpu, label: "Sensors detect flow & characteristics", desc: "Weight, motion, turbidity, and color sensors measure urine properties in real time" },
  { icon: Wifi, label: "Data processed & transmitted", desc: "Onboard microcontroller processes raw signals and transmits to the platform wirelessly" },
  { icon: BarChart3, label: "Dashboard updates live", desc: "Clinicians see real-time graphs, alerts, and trends on the monitoring dashboard" },
];

export default function DeviceOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Device Overview</h1>
        <p className="text-xs text-muted-foreground mt-0.5">How the UroTrack monitoring system works</p>
      </div>

      {/* Purpose */}
      <Card className="p-6 border border-border bg-gradient-to-br from-card to-muted/20">
        <h2 className="text-base font-bold text-foreground mb-2">Device Purpose</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          UroTrack is an inline urine monitoring device designed to automate the measurement and recording of urine output in hospital settings. By continuously tracking volume, flow state, turbidity, and color, UroTrack reduces manual nursing workload while providing clinicians with richer, more timely data for patient care decisions.
        </p>
      </Card>

      {/* Process Flow */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-4">System Process Flow</h2>
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {processSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex-1 flex items-center gap-3"
            >
              <Card className="flex-1 p-4 border border-border hover:border-accent/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-bold text-foreground mb-1">{step.label}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{step.desc}</p>
              </Card>
              {i < processSteps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 hidden md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sensor Breakdown */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-4">Sensor Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEVICE_SENSORS.map((sensor) => {
            const Icon = sensorIcons[sensor.name] || Cpu;
            return (
              <Card key={sensor.name} className="p-5 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-foreground">{sensor.name}</h3>
                      <Badge className="bg-success/10 text-success border border-success/20 text-[9px] px-1.5 py-0">{sensor.status}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono mb-1.5">{sensor.type}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{sensor.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                      <span>Signal: <strong className="text-foreground">{sensor.signal}%</strong></span>
                      <span>Last Cal: <strong className="text-foreground">{sensor.lastCal}</strong></span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Data collection */}
      <Card className="p-6 border border-border">
        <h2 className="text-base font-bold text-foreground mb-3">How Data is Collected & Displayed</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="font-bold text-foreground mb-1">Sensing</p>
            <p className="leading-relaxed">Each sensor captures raw analog signals at configurable sample rates. The load cell measures mass delta, the accelerometer detects flow vibration, and optical sensors measure light transmittance and RGB values.</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="font-bold text-foreground mb-1">Processing</p>
            <p className="leading-relaxed">An onboard microcontroller applies signal conditioning, filtering, and calibration algorithms to convert raw readings into clinically meaningful values — volume in mL, clarity percentage, and color classification.</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="font-bold text-foreground mb-1">Display</p>
            <p className="leading-relaxed">Processed data is transmitted wirelessly to the UroTrack platform, where it is rendered as live charts, trend graphs, and alert notifications for clinical staff to monitor in real time.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
