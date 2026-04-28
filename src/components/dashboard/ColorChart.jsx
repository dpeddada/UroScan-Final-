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

const makeSpectralData = () => {
  return wavelengths.map((wavelength) => {
    const noise = (Math.random() - 0.5) * 0.03;

    return {
      wavelength,
      c0:
        0.25 *
          Math.exp(-Math.pow((wavelength - 500) / 70, 2)) +
        noise,
      c5:
        0.45 *
          Math.exp(-Math.pow((wavelength - 520) / 75, 2)) +
        noise,
      c10:
        0.65 *
          Math.exp(-Math.pow((wavelength - 545) / 80, 2)) +
        noise,
      c15:
        0.85 *
          Math.exp(-Math.pow((wavelength - 570) / 85, 2)) +
        noise,
    };
  });
};

export default function ColorChart() {
  const [data, setData] = useState(makeSpectralData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(makeSpectralData());
    }, 20000);

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
              domain={[0, 1]}
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

            <Line name="0%" dataKey="c0" stroke="#6b7280" strokeWidth={2.5} dot={false} />
            <Line name="5%" dataKey="c5" stroke="#1f77b4" strokeWidth={2.5} dot={false} />
            <Line name="10%" dataKey="c10" stroke="#ff7f0e" strokeWidth={2.5} dot={false} />
            <Line name="15%" dataKey="c15" stroke="#d62728" strokeWidth={2.5} dot={false} />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
