const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 🟢 Status Route: Used by the OS for System Telemetry
app.get('/ping', (req, res) => {
  res.status(200).json({ 
    status: 'active', 
    node: 'AETHER-01',
    uptime: process.uptime() 
  });
});

app.listen(process.env.PORT || 3000, () => console.log('Aether Core Online'));
