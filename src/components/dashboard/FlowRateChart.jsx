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
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 25 }}
          >
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              label={{
                value: "Time (s)",
                position: "insideBottom",
                offset: -10,
              }}
            />

            <YAxis
              domain={[0, 30]}
              tick={{ fontSize: 11 }}
              label={{
                value: "Flow Rate (mL/s)",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip />
            <Legend verticalAlign="top" align="left" />

            <Line
              name="No Flow"
              type="monotone"
              dataKey="noFlow"
              stroke="#7f7f7f"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              name="Low Flow"
              type="monotone"
              dataKey="lowFlow"
              stroke="#1f77b4"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              name="Medium Flow"
              type="monotone"
              dataKey="mediumFlow"
              stroke="#ff7f0e"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              name="High Flow"
              type="monotone"
              dataKey="highFlow"
              stroke="#d62728"
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
