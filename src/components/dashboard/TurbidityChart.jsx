import { Card } from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function TurbidityChart({ data = [] }) {
  return (
    <Card className="p-5 border border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Turbidity — Clarity Index
          </h3>
          <p className="text-[11px] text-muted-foreground">
            rNTU trend from device telemetry
          </p>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 88%)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: "hsl(215 12% 50%)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(215 12% 50%)" }}
              domain={[0, "auto"]}
            />
            <Tooltip formatter={(value) => [`${value} rNTU`, "Turbidity"]} />
            <ReferenceLine y={100} stroke="hsl(0 65% 55%)" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="turbidity"
              stroke="hsl(210 70% 45%)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
