import { Card } from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function FlowRateChart({ data = [] }) {
  return (
    <Card className="p-5 border border-border bg-white">
      <h3 className="text-center text-base font-semibold mb-4">
        Instantaneous Flow Rate vs Time
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 25, left: 25, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              label={{ value: "Time (s)", position: "insideBottom", offset: -10 }}
            />

            <YAxis
              tick={{ fontSize: 11 }}
              label={{
                value: "Flow Rate (mL/s)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />

            <Tooltip />
            <Legend verticalAlign="top" align="left" wrapperStyle={{ fontSize: 12 }} />

            <Line
              name="Flow Rate"
              type="monotone"
              dataKey="flowRate"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
