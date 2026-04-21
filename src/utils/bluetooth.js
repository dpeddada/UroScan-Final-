let device = null;
let server = null;
let service = null;
let characteristic = null;

// Example UUIDs (these were placeholders / generic before)
const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
const CHARACTERISTIC_UUID = "abcd1234-ab12-cd34-ef56-abcdef123456";

export async function connectESP32() {
  try {
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [SERVICE_UUID],
    });

    server = await device.gatt.connect();
    service = await server.getPrimaryService(SERVICE_UUID);
    characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

    console.log("Connected to ESP32");
    return device;
  } catch (error) {
    console.error("Connection failed:", error);
    throw error;
  }
}

export async function startReading(onData) {
  if (!characteristic) {
    throw new Error("Device not connected");
  }

  await characteristic.startNotifications();

  characteristic.addEventListener("characteristicvaluechanged", (event) => {
    const value = event.target.value;

    const text = new TextDecoder().decode(value);

    try {
      const parsed = JSON.parse(text); // 👈 expects JSON
      onData(parsed);
    } catch (err) {
      console.warn("Invalid JSON received:", text);
    }
  });
}
