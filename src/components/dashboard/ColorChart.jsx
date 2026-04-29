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

const colorChannels = [
  { key: "F1_405", wavelength: 405 },
  { key: "F2_425", wavelength: 425 },
  { key: "FZ_450", wavelength: 450 },
  { key: "F3_475", wavelength: 475 },
  { key: "F4_515", wavelength: 515 },
  { key: "F5_550", wavelength: 550 },
  { key: "FY_555", wavelength: 555 },
  { key: "FXL_600", wavelength: 600 },
  { key: "F6_640", wavelength: 640 },
  { key: "F7_690", wavelength: 690 },
  { key: "F8_745", wavelength: 745 },
  { key: "NIR_855", wavelength: 855 },
];

export default function ColorChart({ data = [] }) {
  const latest = data.length > 0 ? data[data.length - 1] : {};

  const chartData = colorChannels.map((channel) => ({
    wavelength: channel.wavelength,
    intensity: Number(latest[channel.key] ?? 0),
  }));

  return (
    <Card className="p-5 border border-border bg-white">
      <h3 className="text-center text-base font-semibold mb-3 text-black">
        Color Sensor Intensity vs Wavelength
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 25, left: 15, bottom: 30 }}
          >
            <CartesianGrid stroke="#d1d5db" strokeDasharray="3 3" />

            <XAxis
              dataKey="wavelength"
              type="number"
              domain={[400, 900]}
              ticks={[400, 450, 500, 550, 600, 650, 700, 750, 800, 850]}
              tick={{ fontSize: 11, fill: "#111827" }}
              axisLine={{ stroke: "#111827" }}
              tickLine={{ stroke: "#111827" }}
              label={{
                value: "Wavelength (nm)",
                position: "insideBottom",
                offset: -15,
                fill: "#111827",
                fontSize: 12,
              }}
            />

            <YAxis
              domain={[0, "auto"]}
              tick={{ fontSize: 11, fill: "#111827" }}
              axisLine={{ stroke: "#111827" }}
              tickLine={{ stroke: "#111827" }}
              label={{
                value: "Sensor Intensity",
                angle: -90,
                position: "insideLeft",
                fill: "#111827",
                fontSize: 12,
                dy: 45,
              }}
            />

            <Tooltip
              formatter={(value) => `${Number(value).toFixed(0)}`}
              labelFormatter={(value) => `${value} nm`}
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
              name="Sensor Intensity"
              type="monotone"
              dataKey="intensity"
              stroke="#1f77b4"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
