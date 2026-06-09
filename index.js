const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' }));

// CORS Configuration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const BOT_TOKEN = "8610031632:AAF9NwDwfgEokbz6cvg55jH7vFmL8_tEDvs";
const DB_CODE_ENDPOINT = "https://api.npoint.io/E8d53f9c51e5b8d3b5ed";

// Root diagnostic link
app.get('/', (req, res) => {
  res.status(200).send("Aether Lab Edge Secure Script Interpreter Node Active.");
});

app.post('/api/save-code', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).send("Missing code parameter");
    }

    console.log(`📝 Attempting to save code (length: ${code.length}) to npoint...`);
    
    // npoint expects the full payload object structure
    const payload = { code };
    const jsonPayload = JSON.stringify(payload);
    
    console.log(`📤 Payload size: ${jsonPayload.length} bytes`);
    
    const response = await fetch(DB_CODE_ENDPOINT, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: jsonPayload
    });

    const responseText = await response.text();
    console.log(`📥 npoint response (${response.status}):`, responseText.substring(0, 500));
    
    if (response.ok) {
      console.log(`✅ Code saved successfully to npoint`);
      return res.send("OK");
    } else {
      console.error(`❌ npoint rejected save (${response.status}):`, responseText.substring(0, 200));
      return res.status(response.status).send(`Database error: ${responseText}`);
    }
  } catch (e) {
    console.error(`❌ Error in save-code:`, e.message);
    res.status(500).send(`Server error: ${e.message}`);
  }
});

app.get('/api/get-code', async (req, res) => {
  try {
    console.log(`📖 Fetching code from npoint...`);
    const response = await fetch(DB_CODE_ENDPOINT);
    
    if (!response.ok) {
      console.warn(`⚠️ npoint returned ${response.status}`);
      return res.send("");
    }
    
    const data = await response.json();
    console.log(`✅ Code retrieved (length: ${data.code?.length || 0})`);
    res.send(data.code || "");
  } catch (e) {
    console.error(`❌ Error in get-code:`, e.message);
    res.status(500).send("");
  }
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
  } catch (e) { 
    console.error(`❌ Webhook error:`, e.message);
  }
  res.sendStatus(200);
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Aether Lab Runtime Engine listening on port ${PORT}`);
  console.log(`📡 Webhook ready at http://localhost:${PORT}/api/webhook`);
});

module.exports = app;
