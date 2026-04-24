import { Card } from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function FlowRateChart({ data = [] }) {
  return (
    <Card className="p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Flow Rate — Real Time
          </h3>
          <p className="text-[11px] text-muted-foreground">
            mL/s from ESP32 telemetry
          </p>
        </div>

        <span className="text-xs text-success font-semibold">
          LIVE
        </span>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, "auto"]} />
            <Tooltip formatter={(value) => [`${value} mL/s`, "Flow Rate"]} />
            <Line
              type="monotone"
              dataKey="flowRate"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
