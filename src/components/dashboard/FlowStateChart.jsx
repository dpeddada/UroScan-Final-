import { Card } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function FlowStateChart({ data = [] }) {
  const currentFlow =
    data.length > 0 ? data[data.length - 1].flow : 0;

  return (
    <Card className="p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Flow State — Live
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Motion sensor ON/OFF detection
          </p>
        </div>

        <span className="text-xs font-semibold">
          {currentFlow ? "FLOW DETECTED" : "NO FLOW"}
        </span>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 1]} />
            <Tooltip />

            <Area
              type="stepAfter"
              dataKey="flow"
              stroke="#10b981"
              fill="#10b98133"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
