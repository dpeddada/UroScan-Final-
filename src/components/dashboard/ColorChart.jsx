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
      c0: 0.2 * intensityShift * Math.exp(-Math.pow((wavelength - (500 + waveShift)) / 70, 2)),
      c25: 0.32 * intensityShift * Math.exp(-Math.pow((wavelength - (512 + waveShift)) / 72, 2)),
      c5: 0.44 * intensityShift * Math.exp(-Math.pow((wavelength - (524 + waveShift)) / 74, 2)),
      c75: 0.56 * intensityShift * Math.exp(-Math.pow((wavelength - (538 + waveShift)) / 76, 2)),
      c10: 0.68 * intensityShift * Math.exp(-Math.pow((wavelength - (552 + waveShift)) / 80, 2)),
      c15: 0.85 * intensityShift * Math.exp(-Math.pow((wavelength - (570 + waveShift)) / 85, 2)),
    };
  });
};

export default function ColorChart() {
  const [updateCount, setUpdateCount] = useState(0);
  const [data, setData] = useState(makeSpectralData(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateCount((prev) => {
        const next = prev + 1;
        setData(makeSpectralData(next));
        return next;
      });
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
          <LineChart data={data} margin={{ top: 15, right: 25, left: 15, bottom: 30 }}>
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

            <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: "12px" }} />

            <Line name="0%" type="monotone" dataKey="c0" stroke="#6b7280" strokeWidth={2.3} dot={false} isAnimationActive={false} />
            <Line name="2.5%" type="monotone" dataKey="c25" stroke="#1f77b4" strokeWidth={2.3} dot={false} isAnimationActive={false} />
            <Line name="5%" type="monotone" dataKey="c5" stroke="#2ca02c" strokeWidth={2.3} dot={false} isAnimationActive={false} />
            <Line name="7.5%" type="monotone" dataKey="c75" stroke="#ff7f0e" strokeWidth={2.3} dot={false} isAnimationActive={false} />
            <Line name="10%" type="monotone" dataKey="c10" stroke="#9467bd" strokeWidth={2.3} dot={false} isAnimationActive={false} />
            <Line name="15%" type="monotone" dataKey="c15" stroke="#d62728" strokeWidth={2.3} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
