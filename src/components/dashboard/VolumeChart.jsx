import { Card } from "../ui/card";
import {
  ScatterChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ErrorBar,
} from "recharts";

const volumeData = [
  { trueVolume: 0, measuredVolume: 0, error: 10 },
  { trueVolume: 700, measuredVolume: 690, error: 20 },
  { trueVolume: 1400, measuredVolume: 1400, error: 15 },
  { trueVolume: 1900, measuredVolume: 1900, error: 20 },
];

export default function VolumeChart() {
  return (
    <Card className="p-5 border border-border bg-white">
      <h3 className="text-center text-base font-semibold mb-3">
        Measured vs True Volume
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 25, left: 20, bottom: 25 }}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

            <XAxis
              type="number"
              dataKey="trueVolume"
              domain={[0, 2000]}
              tick={{ fontSize: 11 }}
              label={{
                value: "True Volume (mL)",
                position: "insideBottom",
                offset: -10,
              }}
            />

            <YAxis
              type="number"
              dataKey="measuredVolume"
              domain={[0, 2000]}
              tick={{ fontSize: 11 }}
              label={{
                value: "Measured Volume (mL)",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip />
            <Legend verticalAlign="top" align="left" />

            <Line
              name="Ideal (y = x)"
              dataKey="measuredVolume"
              data={[
                { trueVolume: 0, measuredVolume: 0 },
                { trueVolume: 2000, measuredVolume: 2000 },
              ]}
              stroke="#000000"
              strokeDasharray="6 4"
              strokeWidth={2}
              dot={false}
              type="linear"
            />

            <Scatter
              name="Mean Measured Volume"
              data={volumeData}
              fill="#0000ff"
            >
              <ErrorBar
                dataKey="error"
                width={8}
                stroke="#000000"
                direction="y"
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
