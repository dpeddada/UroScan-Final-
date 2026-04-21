import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const phases = [
  {
    phase: "Phase 1",
    title: "Prototype Validation",
    status: "complete",
    period: "Fall 2025 — Spring 2026",
    items: [
      "Define system requirements and sensor specifications",
      "Design inline sensor module and housing",
      "Select microcontroller and communication protocol",
      "Build initial hardware prototype",
      "Develop UroTrack monitoring dashboard (web prototype)",
    ],
  },
  {
    phase: "Phase 2",
    title: "Benchtop Testing",
    status: "active",
    period: "Spring 2026",
    items: [
      "Validate weight sensor accuracy with known fluid volumes",
      "Calibrate turbidity and color sensors",
      "Test motion sensor flow detection reliability",
      "Verify data transmission latency and consistency",
      "Iterate on sensor module mechanical design",
    ],
  },
  {
    phase: "Phase 3",
    title: "Pilot Clinical Workflow Testing",
    status: "upcoming",
    period: "Summer — Fall 2026",
    items: [
      "Simulated clinical environment testing",
      "Nurse and clinician usability feedback sessions",
      "Evaluate alert system effectiveness",
      "Assess workflow integration and time savings",
      "Refine dashboard based on user feedback",
    ],
  },
  {
    phase: "Phase 4",
    title: "Hospital Unit Implementation",
    status: "upcoming",
    period: "2027",
    items: [
      "Deploy on a single hospital unit (ICU pilot)",
      "Integrate with hospital EMR systems",
      "Conduct clinical validation study",
      "Establish maintenance and calibration protocols",
      "Train nursing and clinical staff",
    ],
  },
  {
    phase: "Phase 5",
    title: "Broader Integration & Scaling",
    status: "upcoming",
    period: "2027+",
    items: [
      "Expand to multiple hospital units and departments",
      "Develop multi-device fleet management tools",
      "Pursue regulatory approvals (FDA 510(k) if applicable)",
      "Explore additional sensor capabilities (pH, specific gravity)",
      "Establish manufacturing and distribution pathway",
    ],
  },
];

const statusConfig = {
  complete: { badge: "bg-success/10 text-success border-success/20", icon: CheckCircle, color: "text-success", line: "bg-success" },
  active: { badge: "bg-chart-1/10 text-chart-1 border-chart-1/20", icon: Circle, color: "text-chart-1", line: "bg-chart-1" },
  upcoming: { badge: "bg-muted text-muted-foreground border-border", icon: Circle, color: "text-muted-foreground", line: "bg-border" },
};

export default function Roadmap() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Implementation Roadmap</h1>
        <p className="text-xs text-muted-foreground mt-0.5">From capstone prototype to scalable clinical monitoring platform</p>
      </div>

      <Card className="p-6 border border-border bg-gradient-to-br from-card to-primary/[0.02]">
        <h2 className="text-base font-bold text-foreground mb-2">Scaling Vision</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          UroTrack is designed to evolve from a capstone engineering prototype into a clinically validated, hospital-deployable urine monitoring platform. The roadmap below outlines the key phases from initial validation through broader healthcare integration.
        </p>
      </Card>

      {/* Timeline */}
      <div className="relative">
        {phases.map((phase, i) => {
          const config = statusConfig[phase.status];
          const Icon = config.icon;
          return (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 mb-6 last:mb-0"
            >
              {/* Timeline connector */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-8 h-8 rounded-full ${config.badge} border flex items-center justify-center z-10`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                {i < phases.length - 1 && <div className={`w-0.5 flex-1 mt-1 ${config.line}`} />}
              </div>

              {/* Content */}
              <Card className={`flex-1 p-5 border ${phase.status === 'active' ? 'border-chart-1/30 bg-chart-1/[0.02]' : 'border-border'}`}>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <Badge className={`${config.badge} border text-[10px] px-2 py-0.5`}>{phase.phase}</Badge>
                  <h3 className="text-sm font-bold text-foreground">{phase.title}</h3>
                  <span className="text-[10px] text-muted-foreground font-mono">{phase.period}</span>
                  {phase.status === 'active' && (
                    <Badge className="bg-chart-1/10 text-chart-1 border border-chart-1/20 text-[9px] px-1.5 py-0 animate-live-pulse">CURRENT</Badge>
                  )}
                </div>
                <div className="space-y-1.5">
                  {phase.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className={`w-1 h-1 rounded-full shrink-0 mt-1.5 ${phase.status === 'complete' ? 'bg-success' : phase.status === 'active' ? 'bg-chart-1' : 'bg-border'}`} />
                      <span className={phase.status === 'complete' ? 'line-through opacity-60' : ''}>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
