let device = null;
let server = null;
let service = null;
let txCharacteristic = null;
let lineBuffer = "";
let notifyHandler = null;

const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const TX_CHAR_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

function parseKeyValueLine(line, prefix) {
  if (!line || !line.startsWith(prefix)) return null;

  const payload = line.slice(prefix.length);
  const parts = payload.split(",");
  const result = { lineType: prefix.replace(",", "") };

  for (const part of parts) {
    const eqIndex = part.indexOf("=");
    if (eqIndex === -1) continue;

    const key = part.slice(0, eqIndex).trim();
    const value = part.slice(eqIndex + 1).trim();

    result[key] = value;
  }

  return result;
}

function parseIncomingLine(line) {
  if (line.startsWith("DATA,")) {
    return parseKeyValueLine(line, "DATA,");
  }

  if (line.startsWith("SPECTRAL,")) {
    return parseKeyValueLine(line, "SPECTRAL,");
  }

  return null;
}

export async function connectESP32() {
  try {
    if (!navigator.bluetooth) {
      throw new Error("Web Bluetooth is not supported in this browser.");
    }

    if (device && device.gatt && device.gatt.connected && txCharacteristic) {
      return device;
    }

    device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "Uro" }],
      optionalServices: [SERVICE_UUID],
    });

    device.addEventListener("gattserverdisconnected", () => {
      server = null;
      service = null;
      txCharacteristic = null;
      notifyHandler = null;
      lineBuffer = "";
      console.log("ESP32 Bluetooth disconnected.");
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
      txCharacteristic.removeEventListener(
        "characteristicvaluechanged",
        notifyHandler
      );
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

        const parsed = parseIncomingLine(line);

        if (parsed) {
          onParsedData(parsed);
        }
      }
    };

    await txCharacteristic.startNotifications();

    txCharacteristic.addEventListener(
      "characteristicvaluechanged",
      notifyHandler
    );
  } catch (error) {
    console.error("startReading error:", error);
    throw error;
  }
}

export async function stopReading() {
  try {
    if (txCharacteristic && notifyHandler) {
      txCharacteristic.removeEventListener(
        "characteristicvaluechanged",
        notifyHandler
      );

      try {
        await txCharacteristic.stopNotifications();
      } catch (error) {
        console.warn("Notifications may already be stopped:", error);
      }

      notifyHandler = null;
      lineBuffer = "";
    }
  } catch (error) {
    console.error("stopReading error:", error);
  }
}

export async function disconnectESP32() {
  try {
    await stopReading();

    if (device && device.gatt && device.gatt.connected) {
      device.gatt.disconnect();
    }

    device = null;
    server = null;
    service = null;
    txCharacteristic = null;
    notifyHandler = null;
    lineBuffer = "";
  } catch (error) {
    console.error("disconnectESP32 error:", error);
  }
}
