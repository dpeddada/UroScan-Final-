import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Monitor, Activity, Shield, Wifi } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(215,30%,16%)] via-[hsl(210,35%,20%)] to-[hsl(215,25%,12%)] flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 border border-white/20 rounded-full" />
          <div className="absolute bottom-32 right-16 w-96 h-96 border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 border border-white/15 rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-[hsl(175,55%,50%)]/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-[hsl(175,55%,50%)]/30">
            <Monitor className="w-10 h-10 text-[hsl(175,55%,50%)]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">UroTrack</h1>
          <p className="text-lg text-white/60 font-light mb-12">
            Real-Time Urine Output Monitoring<br />for Improved Clinical Workflow
          </p>

          <div className="grid grid-cols-3 gap-6 mt-8">
            {[
              { icon: Activity, label: "Live Monitoring", desc: "Real-time sensor data" },
              { icon: Shield, label: "Clinical Grade", desc: "Hospital-ready platform" },
              { icon: Wifi, label: "Connected", desc: "Wireless device sync" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[hsl(175,55%,50%)]" />
                </div>
                <span className="text-xs font-medium text-white/80">{item.label}</span>
                <span className="text-[10px] text-white/40">{item.desc}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="absolute bottom-8 text-center">
          <p className="text-[10px] text-white/30">Biomedical Engineering Capstone Project © 2026</p>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 lg:max-w-xl flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[hsl(175,55%,50%)]/20 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-[hsl(175,55%,50%)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">UroTrack</h1>
              <p className="text-[11px] text-white/50">Monitoring Platform</p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">Welcome back</h2>
              <p className="text-sm text-muted-foreground mt-1">Sign in to access the monitoring dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Email or Staff ID</Label>
                <Input
                  type="email"
                  placeholder="nurse@hospital.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 bg-muted/50 border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 bg-muted/50 border-border"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  Remember this device
                </label>
                <button type="button" className="text-[hsl(175,55%,50%)] hover:underline font-medium">Forgot password?</button>
              </div>

              <Button type="submit" className="w-full h-10 bg-[hsl(210,70%,32%)] hover:bg-[hsl(210,70%,28%)] text-white font-medium">
                Access Dashboard
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-[10px] text-muted-foreground text-center">
                Authorized hospital personnel only. All access is logged and monitored.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
