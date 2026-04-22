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

export default function LiveVolumeChart({ data = [] }) {
  return (
    <Card className="p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Urine Volume — Real Time
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Volume trend (last 2 minutes)
          </p>
        </div>
      </div>

      <div className="h-52">
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
            <Tooltip />
            <Line
              type="monotone"
              dataKey="volume"
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
