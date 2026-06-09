const express = require('express');
const app = express();

app.use(express.json());

// CORS Configuration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const BOT_TOKEN = "8610031632:AAF9NwDwfgEokbz6cvg55jH7vFmL8_tEDvs";
const DB_CODE_ENDPOINT = "https://api.npoint.io/E8d53f9c51e5b8d3b5ed";

app.post('/api/save-code', async (req, res) => {
  try {
    const { code } = req.body;
    const response = await fetch(DB_CODE_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    return response.ok ? res.send("OK") : res.status(500).send("DB Error");
  } catch (e) { res.status(500).send(e.message); }
});

app.get('/api/get-code', async (req, res) => {
  try {
    const response = await fetch(DB_CODE_ENDPOINT);
    const data = await response.json();
    res.send(data.code || "");
  } catch (e) { res.status(500).send(""); }
});

app.post('/api/webhook', async (req, res) => {
  const { message } = req.body;
  if (!message?.text) return res.sendStatus(200);
  
  try {
    const response = await fetch(DB_CODE_ENDPOINT);
    const data = await response.json();
    const script = Buffer.from(data.code, 'base64').toString('utf-8');
    const fn = new Function('msg', 'BOT_TOKEN', script);
    await fn(message, BOT_TOKEN);
  } catch (e) { console.error(e); }
  res.sendStatus(200);
});

module.exports = app;
