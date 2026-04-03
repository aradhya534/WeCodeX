const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let packetsReceived = [];
let twilioLogs = [];

// Mock Twilio Alert System
const mockTwilioSend = (packet) => {
  const logMsg = `SMS sent to responders: "Emergency: ${packet.severity} at location: (${packet.location.lat.toFixed(4)}, ${packet.location.lng.toFixed(4)})"`;
  twilioLogs.unshift({
    id: packet.id,
    timestamp: new Date().toISOString(),
    message: logMsg
  });
};

app.post('/api/sos', (req, res) => {
  const { packets } = req.body;
  if (!packets || !Array.isArray(packets)) {
    return res.status(400).json({ error: 'Invalid payload, expected array of packets' });
  }

  packets.forEach(packet => {
    // Basic deduplication mock
    if (!packetsReceived.find(p => p.id === packet.id)) {
      packet.receivedAt = new Date().toISOString();
      packetsReceived.unshift(packet);
      // Simulate Alert
      mockTwilioSend(packet);
    }
  });

  res.json({ success: true, message: 'Packets processed successfully', received: packets.length });
});

app.get('/api/packets', (req, res) => {
  res.json({
    packets: packetsReceived,
    logs: twilioLogs
  });
});

app.get('/', (req, res) => {
  res.send('Backend is running and active. Send SOS packets to POST /api/sos.');
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'online', totalPacketsReceived: packetsReceived.length });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
