// ONLY showing the changed parts to keep this readable
// (everything else stays exactly the same)

const [chartData, setChartData] = useState([]);
const [spectralData, setSpectralData] = useState([]);

// ---------------- DEMO MODE ----------------
const addDemoPoint = () => {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const flowRate = 2.5 + (Math.random() - 0.5) * 1.8;
  const peakFlowRate = flowRate + 0.8 + Math.random() * 1.4;
  const turbidity = 45 + (Math.random() - 0.5) * 35;
  const colorCode = Math.floor(Math.random() * 6);

  const spectralPoint = {
    time,
    F1_405: 45 + Math.random() * 30,
    F2_425: 82 + Math.random() * 40,
    FZ_450: 156 + Math.random() * 80,
    F3_475: 61 + Math.random() * 40,
    F4_515: 123 + Math.random() * 60,
    F5_550: 49 + Math.random() * 30,
    FY_555: 160 + Math.random() * 80,
    FXL_600: 115 + Math.random() * 50,
    F6_640: 62 + Math.random() * 35,
    F7_690: 25 + Math.random() * 20,
    F8_745: 3 + Math.random() * 8,
    NIR_855: 3 + Math.random() * 8,
  };

  setSpectralData((prev) => [...prev.slice(-9), spectralPoint]);

  setChartData((prev) => {
    const lastVolume = prev.length > 0 ? prev[prev.length - 1].volume : 0;
    const volume = lastVolume + flowRate * 20 + Math.random() * 20;

    return [
      ...prev.slice(-59),
      {
        time,
        flowRate,
        peakFlowRate,
        volume,
        turbidity,
        colorCode,
      },
    ];
  });
};

// ---------------- REAL DATA ----------------
await startReading((parsed) => {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // 🔴 HANDLE SPECTRAL DATA
  if (parsed.lineType === "SPECTRAL") {
    setSpectralData((prev) => [
      ...prev.slice(-9),
      {
        time,
        F1_405: Number(parsed.F1_405 || 0),
        F2_425: Number(parsed.F2_425 || 0),
        FZ_450: Number(parsed.FZ_450 || 0),
        F3_475: Number(parsed.F3_475 || 0),
        F4_515: Number(parsed.F4_515 || 0),
        F5_550: Number(parsed.F5_550 || 0),
        FY_555: Number(parsed.FY_555 || 0),
        FXL_600: Number(parsed.FXL_600 || 0),
        F6_640: Number(parsed.F6_640 || 0),
        F7_690: Number(parsed.F7_690 || 0),
        F8_745: Number(parsed.F8_745 || 0),
        NIR_855: Number(parsed.NIR_855 || 0),
      },
    ]);
    return;
  }

  // 🟢 NORMAL DATA (UNCHANGED)
  const volume = parseFloat(parsed.volume_ml);
  const flowRate = parseFloat(parsed.flow_rate_mLs);
  const turbidity = parseFloat(parsed.turbidity_rntu);
  const colorCode = parseInt(parsed.color_code, 10);
  const flowFlag = String(parsed.motion_flag) === "1";

  const safeVolume = Number.isFinite(volume) ? volume : 0;
  const safeFlowRate = Number.isFinite(flowRate) ? flowRate : 0;
  const safePeakFlowRate = safeFlowRate * 1.25;
  const safeTurbidity = Number.isFinite(turbidity) ? turbidity : 0;
  const safeColorCode = Number.isFinite(colorCode) ? colorCode : 0;

  setChartData((prev) => [
    ...prev.slice(-59),
    {
      time,
      flowRate: safeFlowRate,
      peakFlowRate: safePeakFlowRate,
      volume: safeVolume,
      turbidity: safeTurbidity,
      colorCode: safeColorCode,
    },
  ]);
});
