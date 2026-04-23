let device = null;
let server = null;
let service = null;
let txCharacteristic = null;
let lineBuffer = "";
let notifyHandler = null;

const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const TX_CHAR_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

function parseDataLine(line) {
  if (!line || !line.startsWith("DATA,")) return null;

  const payload = line.slice(5);
  const parts = payload.split(",");
  const result = {};

  for (const part of parts) {
    const eqIndex = part.indexOf("=");
    if (eqIndex === -1) continue;

    const key = part.slice(0, eqIndex).trim();
    const value = part.slice(eqIndex + 1).trim();
    result[key] = value;
  }

  return result;
}

export async function connectESP32() {
  try {
    if (!navigator.bluetooth) {
      throw new Error("Web Bluetooth is not supported in this browser.");
    }

    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [SERVICE_UUID]
    });

    server = await device.gatt.connect();
    service = await server.getPrimaryService(SERVICE_UUID);
    txCharacteristic = await service.getCharacteristic(TX_CHAR_UUID);

    lineBuffer = "";
    return device;
  } catch (error) {
    console.error("connectESP32 error:", error);
    throw error;
  }
}

export async function startReading(onParsedData) {
  try {
    if (!txCharacteristic) {
      throw new Error("Bluetooth device not connected.");
    }

    if (notifyHandler) {
      txCharacteristic.removeEventListener("characteristicvaluechanged", notifyHandler);
    }

    lineBuffer = "";

    notifyHandler = function (event) {
      const value = event.target.value;
      const chunk = new TextDecoder().decode(value);

      lineBuffer += chunk;

      const lines = lineBuffer.split(/\r?\n/);
      lineBuffer = lines.pop() || "";

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        const parsed = parseDataLine(line);
        if (parsed) {
          onParsedData(parsed);
        }
      }
    };

    await txCharacteristic.startNotifications();
    txCharacteristic.addEventListener("characteristicvaluechanged", notifyHandler);
  } catch (error) {
    console.error("startReading error:", error);
    throw error;
  }
}
