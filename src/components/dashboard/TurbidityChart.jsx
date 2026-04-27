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

export default function TurbidityChart({ data = [] }) {
  return (
    <Card className="p-5 border border-border">
      <h3 className="text-sm font-semibold">Turbidity vs Time</h3>
      <p className="text-[11px] text-muted-foreground mb-4">
        X-axis: Time | Y-axis: Turbidity (rNTU)
      </p>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: "Time", position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: "Turbidity (rNTU)", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="turbidity"
              stroke="#14b8a6"
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
