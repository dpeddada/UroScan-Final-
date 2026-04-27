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

export default function ColorChart({ data = [] }) {
  return (
    <Card className="p-5 border border-border">
      <h3 className="text-sm font-semibold">Color Value vs Time</h3>
      <p className="text-[11px] text-muted-foreground mb-4">
        X-axis: Time | Y-axis: Color Code
      </p>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: "Time", position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: "Color Code", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="colorCode"
              stroke="#f59e0b"
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
