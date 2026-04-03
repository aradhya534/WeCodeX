import { savePacket } from './storageService';

export async function createPacket(message, severity) {
  let location = { lat: 0, lng: 0 };
  
  if (navigator.geolocation) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch (e) {
      console.warn("Geolocation failed/denied, using mock location");
      // Fallback location for demo purposes
      location = { lat: 37.7749, lng: -122.4194 };
    }
  }

  const packet = {
    id: crypto.randomUUID(),
    message,
    severity,
    location,
    ttl: 6,
    hops: 0,
    timestamp: new Date().toISOString()
  };

  await savePacket(packet);
  return packet;
}

export async function syncPacketsWithBackend(packets) {
  // Sync to mock backend
  try {
    const res = await fetch('http://localhost:3000/api/sos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ packets })
    });
    return res.ok;
  } catch (error) {
    console.error("Backend sync failed:", error);
    return false;
  }
}
