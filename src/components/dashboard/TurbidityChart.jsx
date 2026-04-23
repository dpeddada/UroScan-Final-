import { Card } from "@/components/ui/card";
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
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Turbidity — Clarity Index
        </h3>
        <p className="text-[11px] text-muted-foreground">
          rNTU trend from device
        </p>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="turbidity"
              stroke="#3b82f6"
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
