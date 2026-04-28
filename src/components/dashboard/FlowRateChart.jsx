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
  const chartData = data.map((point, index) => {
    const baseFlow = Number(point.flowRate ?? 0);

    return {
      time: point.time ?? `${index * 20}`,
      noFlow: 0,
      lowFlow: point.lowFlow ?? baseFlow * 0.5,
      mediumFlow: point.mediumFlow ?? baseFlow,
      highFlow: point.highFlow ?? baseFlow * 1.5,
    };
  });

  return (
    <Card className="p-5 border border-border bg-white">
      <h3 className="text-center text-base font-semibold mb-3 text-black">
        Instantaneous Flow Rate vs Time
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 25, left: 15, bottom: 30 }}
          >
            <CartesianGrid stroke="#d1d5db" strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#111827" }}
              axisLine={{ stroke: "#111827" }}
              tickLine={{ stroke: "#111827" }}
              label={{
                value: "Time (s)",
                position: "insideBottom",
                offset: -15,
                fill: "#111827",
                fontSize: 12,
              }}
            />

            <YAxis
              domain={[0, 8]}
              tick={{ fontSize: 11, fill: "#111827" }}
              axisLine={{ stroke: "#111827" }}
              tickLine={{ stroke: "#111827" }}
              label={{
                value: "Flow Rate (mL/s)",
                angle: -90,
                position: "insideLeft",
                fill: "#111827",
                fontSize: 12,
                dy: 45,
              }}
            />

            <Tooltip
              formatter={(value) => `${Number(value).toFixed(2)} mL/s`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #d1d5db",
                fontSize: "12px",
              }}
            />

            <Legend
              verticalAlign="top"
              align="center"
              wrapperStyle={{ fontSize: "12px" }}
            />

            <Line
              name="No Flow"
              type="monotone"
              dataKey="noFlow"
              stroke="#7f7f7f"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              name="Low Flow"
              type="monotone"
              dataKey="lowFlow"
              stroke="#1f77b4"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              name="Medium Flow"
              type="monotone"
              dataKey="mediumFlow"
              stroke="#ff7f0e"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              name="High Flow"
              type="monotone"
              dataKey="highFlow"
              stroke="#d62728"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
