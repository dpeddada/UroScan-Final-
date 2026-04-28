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
      <h3 className="text-center text-base font-semibold mb-3">
        Instantaneous Flow Rate vs Time
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 25, left: 20, bottom: 25 }}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#374151" }}
              label={{ value: "Time (s)", position: "insideBottom", offset: -10 }}
            />

            <YAxis
              tick={{ fontSize: 11, fill: "#374151" }}
              label={{
                value: "Flow Rate (mL/s)",
                angle: -90,
                position: "insideLeft",
                offset: -5,
              }}
            />

            <Tooltip />
            <Legend verticalAlign="top" align="left" />

            <Line
              name="Flow Rate"
              type="monotone"
              dataKey="flowRate"
              stroke="#1f77b4"
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
