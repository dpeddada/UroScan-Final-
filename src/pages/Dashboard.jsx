import { useState } from "react";
import SummaryCards from "@/components/dashboard/SummaryCards";
import LiveVolumeChart from "@/components/dashboard/LiveVolumeChart";
import FlowStateChart from "@/components/dashboard/FlowStateChart";
import TurbidityChart from "@/components/dashboard/TurbidityChart";
import RecentAlertsTable from "@/components/dashboard/RecentAlertsTable";
import PatientDeviceTable from "@/components/dashboard/PatientDeviceTable";
import { connectESP32, startReading } from "@/utils/bluetooth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState({
    volume: "0.00 mL",
    flowState: "Idle",
    flowSub: "0.00 mL/s",
    turbidity: "0.0 rNTU",
    turbiditySub: "Label: A",
    color: "NA",
    colorSub: "Code: -1",
    alerts: "0",
    alertsSub: "No active alerts",
    lastSync: "Not connected",
    lastSyncSub: "BLE idle",
    deviceStatus: "Disconnected",
    deviceSub: "UroScale",
    bagFill: "0%",
    bagFillSub: "~0.00 mL / 2,000 mL",
  });

  const [volumeHistory, setVolumeHistory] = useState([]);
  const [flowHistory, setFlowHistory] = useState([]);
  const [turbidityHistory, setTurbidityHistory] = useState([]);

  const handleConnect = async () => {
    try {
      await connectESP32();
      setSummaryData((prev) => ({
        ...prev,
        deviceStatus: "Connected",
        deviceSub: "UroScale",
        lastSync: "Just now",
        lastSyncSub
