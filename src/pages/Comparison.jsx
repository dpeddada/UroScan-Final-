import { Card } from "@/components/ui/card";
import { Check, X, ArrowRight, Clock, ClipboardList, AlertTriangle, TrendingUp, Users, Activity, BarChart3, Shield } from "lucide-react";
import { motion } from "framer-motion";

const manualProblems = [
  { icon: Clock, text: "Nurses manually check urine bags every 1–4 hours" },
  { icon: ClipboardList, text: "Repeated manual recording on paper or EMR" },
  { icon: AlertTriangle, text: "Risk of missed measurements during busy shifts" },
  { icon: Clock, text: "Time-consuming workflow — ~15 min per patient per shift" },
  { icon: TrendingUp, text: "Delayed recognition of patient changes" },
  { icon: ClipboardList, text: "Inconsistent charting across care teams" },
  { icon: Users, text: "Staff fatigue and increased workload burden" },
];

const automatedBenefits = [
  { icon: Activity, text: "Automated continuous urine monitoring" },
  { icon: BarChart3, text: "Live sensor tracking with real-time graphs" },
  { icon: TrendingUp, text: "Real-time visual data for trending" },
  { icon: Users, text: "Reduced manual nursing workload" },
  { icon: ClipboardList, text: "More consistent documentation" },
  { icon: AlertTriangle, text: "Faster recognition of clinical issues" },
  { icon: Shield, text: "Improved clinical decision support" },
];

export default function Comparison() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Manual vs Automated Workflow</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Understanding the problem UroTrack solves</p>
      </div>

      {/* Problem statement */}
      <Card className="p-6 border border-border bg-gradient-to-r from-destructive/5 to-card">
        <h2 className="text-base font-bold text-foreground mb-2">The Current Hospital Challenge</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          In most hospital units, urine output monitoring is entirely manual. Nurses must physically check drainage bags, estimate volumes, and manually document readings. This process is time-consuming, inconsistent, and prone to missed data points — especially during high-acuity shifts.
        </p>
      </Card>

      {/* Side by side comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Workflow */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Card className="p-6 border border-destructive/20 bg-destructive/[0.02] h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <X className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Current Manual Workflow</h3>
                <p className="text-[11px] text-muted-foreground">Standard nursing urine monitoring</p>
              </div>
            </div>
            <div className="space-y-3">
              {manualProblems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-background/60 rounded-lg border border-border/50">
                  <div className="w-6 h-6 rounded-md bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-3 h-3 text-destructive" />
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* UroTrack Workflow */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Card className="p-6 border border-success/20 bg-success/[0.02] h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">UroTrack Automated Workflow</h3>
                <p className="text-[11px] text-muted-foreground">Continuous automated monitoring</p>
              </div>
            </div>
            <div className="space-y-3">
              {automatedBenefits.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-background/60 rounded-lg border border-border/50">
                  <div className="w-6 h-6 rounded-md bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-3 h-3 text-success" />
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Impact summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Time Saved", value: "~75%", desc: "Per patient per shift" },
          { label: "Data Points", value: "10x", desc: "More readings captured" },
          { label: "Alert Speed", value: "<1 min", desc: "vs 1–4 hour delay" },
          { label: "Charting", value: "Auto", desc: "Consistent & complete" },
        ].map((stat, i) => (
          <Card key={i} className="p-4 border border-border text-center">
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs font-semibold text-foreground mt-1">{stat.label}</p>
            <p className="text-[10px] text-muted-foreground">{stat.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
