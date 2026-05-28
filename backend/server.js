const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 🟢 Telemetry: The OS logs will read this to show status
app.get('/ping', (req, res) => res.status(200).json({ status: 'active', node: 'AETHER-01' }));

// 🔴 Ghost Router
app.get('/api/rip', (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'No target specified' });
  res.redirect(`https://en.savefrom.net/${url}`);
});

app.listen(process.env.PORT || 3000, () => console.log('Aether Core Online'));
