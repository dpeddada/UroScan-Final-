import { useEffect, useState } from "react";
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

const wavelengths = Array.from({ length: 36 }, (_, i) => 400 + i * 10);
const wavelengthTicks = [400, 450, 500, 550, 600, 650, 700, 750];

const makeSpectralData = (shift = 0) => {
  return wavelengths.map((wavelength) => {
    const waveShift = Math.sin(shift) * 45;
    const intensityShift = 1 + Math.sin(shift * 1.4) * 0.35;

    return {
      wavelength,
      spectralResponse:
        0.85 *
        intensityShift *
        Math.exp(-Math.pow((wavelength - (570 + waveShift)) / 85, 2)),
    };
  });
};

export default function ColorChart() {
  const [data, setData] = useState(makeSpectralData(0));

  useEffect(() => {
    let count = 0;

    const interval = setInterval(() => {
      count += 1;
      setData(makeSpectralData(count));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-5 border border-border bg-white">
      <h3 className="text-center text-base font-semibold mb-3 text-black">
        Spectral Response vs Wavelength
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 15, right: 25, left: 15, bottom: 30 }}
          >
            <CartesianGrid stroke="#d1d5db" strokeDasharray="3 3" />

            <XAxis
              dataKey="wavelength"
              type="number"
              domain={[400, 750]}
              ticks={wavelengthTicks}
              interval={0}
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
              domain={[0, 1.2]}
              tick={{ fontSize: 11, fill: "#111827" }}
              axisLine={{ stroke: "#111827" }}
              tickLine={{ stroke: "#111827" }}
              label={{
                value: "Spectral Response (a.u.)",
                angle: -90,
                position: "insideLeft",
                fill: "#111827",
                fontSize: 12,
                dy: 45,
              }}
            />

            <Tooltip
              formatter={(value) => Number(value).toFixed(3)}
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
              name="Spectral Response"
              type="monotone"
              dataKey="spectralResponse"
              stroke="#1f77b4"
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
