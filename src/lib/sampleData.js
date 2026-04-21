// Sample patient and device data for the UroTrack prototype

export const PATIENTS = [
  { id: "PT-4821", name: "Patient A", room: "ICU-12", device: "UT-001", status: "active", age: 67, admitDate: "2026-04-10" },
  { id: "PT-3907", name: "Patient B", room: "ICU-08", device: "UT-002", status: "active", age: 54, admitDate: "2026-04-12" },
  { id: "PT-5134", name: "Patient C", room: "STEP-03", device: "UT-003", status: "active", age: 72, admitDate: "2026-04-14" },
  { id: "PT-2789", name: "Patient D", room: "ICU-15", device: "UT-004", status: "alert", age: 45, admitDate: "2026-04-11" },
  { id: "PT-6201", name: "Patient E", room: "STEP-07", device: "UT-005", status: "active", age: 61, admitDate: "2026-04-13" },
  { id: "PT-1456", name: "Patient F", room: "ICU-03", device: "UT-006", status: "inactive", age: 78, admitDate: "2026-04-09" },
];

export const ALERTS_DATA = [
  { id: 1, type: "no_flow", severity: "high", patient: "PT-4821", device: "UT-001", room: "ICU-12", time: "14:32", message: "No flow detected for 4+ hours", action: "Assess catheter patency and patient hydration status" },
  { id: 2, type: "rapid_output", severity: "critical", patient: "PT-2789", device: "UT-004", room: "ICU-15", time: "14:18", message: "Rapid urine output increase — 280 mL in 30 min", action: "Evaluate for diuretic response or fluid overload correction" },
  { id: 3, type: "turbidity", severity: "medium", patient: "PT-3907", device: "UT-002", room: "ICU-08", time: "13:45", message: "Abnormal turbidity detected — clarity index dropped below threshold", action: "Consider urinalysis and infection workup" },
  { id: 4, type: "color_change", severity: "medium", patient: "PT-5134", device: "UT-003", room: "STEP-03", time: "13:22", message: "Urine color shifted from pale yellow to dark amber", action: "Assess hydration and fluid intake" },
  { id: 5, type: "bag_full", severity: "high", patient: "PT-6201", device: "UT-005", room: "STEP-07", time: "12:50", message: "Collection bag at 92% capacity", action: "Empty urine collection bag" },
  { id: 6, type: "sensor_disconnect", severity: "low", patient: "PT-1456", device: "UT-006", room: "ICU-03", time: "12:15", message: "Weight sensor signal intermittent", action: "Check sensor connection and cable integrity" },
  { id: 7, type: "stale_data", severity: "low", patient: "PT-1456", device: "UT-006", room: "ICU-03", time: "11:40", message: "No data sync for 45+ minutes", action: "Verify device power and network connectivity" },
  { id: 8, type: "device_inactive", severity: "medium", patient: "PT-1456", device: "UT-006", room: "ICU-03", time: "11:00", message: "Device marked inactive — no readings", action: "Reconnect device or assign replacement" },
];

export const DEVICE_SENSORS = [
  { name: "Weight Sensor", type: "Load Cell", description: "Estimates urine volume by measuring mass changes in the collection bag using a high-precision load cell.", status: "active", signal: 98, lastCal: "2026-04-15" },
  { name: "Motion Sensor", type: "Accelerometer", description: "Detects active flow state (ON/OFF) by sensing fluid movement through the drainage tubing.", status: "active", signal: 95, lastCal: "2026-04-14" },
  { name: "Turbidity Sensor", type: "Optical", description: "Measures urine clarity using an infrared light transmittance method to detect particulates or cloudiness.", status: "active", signal: 92, lastCal: "2026-04-13" },
  { name: "Color Sensor", type: "RGB Photodiode", description: "Monitors urine color variations by analyzing RGB light absorption, classifying from pale yellow to dark amber.", status: "active", signal: 97, lastCal: "2026-04-15" },
];

export function generateTimeSeriesData(points = 60, baseValue = 30, variance = 15) {
  const data = [];
  let value = baseValue;
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    value = Math.max(0, value + (Math.random() - 0.48) * variance);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      timestamp: time.getTime(),
      value: Math.round(value * 10) / 10,
    });
  }
  return data;
}

export function generateFlowData(points = 60) {
  const data = [];
  const now = new Date();
  let flowing = false;
  let counter = 0;
  for (let i = points; i >= 0; i--) {
    counter++;
    if (counter > 5 + Math.random() * 10) {
      flowing = !flowing;
      counter = 0;
    }
    const time = new Date(now.getTime() - i * 60000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      timestamp: time.getTime(),
      value: flowing ? 1 : 0,
      label: flowing ? "Flow" : "No Flow",
    });
  }
  return data;
}

export function generateTurbidityData(points = 60) {
  return generateTimeSeriesData(points, 85, 8);
}

export function generateColorData(points = 60) {
  const colors = ["Pale Yellow", "Light Yellow", "Yellow", "Dark Yellow", "Amber", "Dark Amber"];
  const data = [];
  const now = new Date();
  let idx = 1;
  for (let i = points; i >= 0; i--) {
    if (Math.random() > 0.9) idx = Math.min(5, Math.max(0, idx + (Math.random() > 0.5 ? 1 : -1)));
    const time = new Date(now.getTime() - i * 60000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      timestamp: time.getTime(),
      value: idx,
      label: colors[idx],
    });
  }
  return data;
}
