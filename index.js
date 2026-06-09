const express = require('express');
const app = express();

app.use(express.json());

// 🛡️ SECURITY SHUNT: Force universal CORS parameters so iPad Safari/Chrome can connect cleanly
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const BOT_TOKEN = "8610031632:AAF9NwDwfgEokbz6cvg55jH7vFmL8_tEDvs";
const DB_CODE_ENDPOINT = "https://kvdb.io/aether_lab_cfg_8610031632/bot_live_code_v5";

// Root diagnostic endpoint
app.get('/', (req, res) => {
  res.status(200).send("Aether Lab Edge Secure Script Interpreter Node Active.");
});

// TUNNEL ROUTE A: Receives base64 string stream from iPad and pushes it server-to-server to the cloud database
app.post('/api/save-code', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).send("Missing code package data stream");

    const dbAction = await fetch(DB_CODE_ENDPOINT, {
      method: 'PUT',
      body: code
    });

    if (dbAction.ok) {
      return res.status(200).send("OK");
    } else {
      return res.status(500).send("Database node rejected stream write");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// TUNNEL ROUTE B: Fetches saved script vectors server-to-server to safely populate your iPad editor view
app.get('/api/get-code', async (req, res) => {
  try {
    const dbResponse = await fetch(DB_CODE_ENDPOINT);
    if (!dbResponse.ok) return res.status(200).send(""); 
    const codeText = await dbResponse.text();
    return res.status(200).send(codeText);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// Main Telegram Webhook Pipeline Interceptor
app.post('/api/webhook', async (req, res) => {
  res.sendStatus(200); // Instantly discharge transaction threads to clear delivery queues

  const update = req.body;
  if (!update || !update.message || (!update.message.text && !update.message.photo)) return;

  const msg = update.message;
  const originalText = msg.text ? msg.text.trim() : "";
  const lowerText = originalText.toLowerCase();
  const targetChatId = msg.chat.id;

  try {
    const dbQueryResponse = await fetch(DB_CODE_ENDPOINT);
    if (!dbQueryResponse.ok) throw new Error("Cloud script database read failure.");
    
    const base64EncryptedCodeDataString = await dbQueryResponse.text();
    if (!base64EncryptedCodeDataString || base64EncryptedCodeDataString.trim() === "") {
      throw new Error("No logic script file inside runtime storage memory registry.");
    }

    const customInjectedJavaScriptCodeString = Buffer.from(base64EncryptedCodeDataString.trim(), 'base64').toString('utf-8');

    const AsyncFunctionConstructor = Object.getPrototypeOf(async function(){}).constructor;
    const executeLiveInjectedScriptNode = new AsyncFunctionConstructor(
      'msg', 'originalText', 'lowerText', 'targetChatId', 'BOT_TOKEN', 
      customInjectedJavaScriptCodeString
    );

    await executeLiveInjectedScriptNode(msg, originalText, lowerText, targetChatId, BOT_TOKEN);

  } catch (error) {
    console.error("Compilation runtime fault exception encounter:", error);
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: `⚠️ <b>Aether Lab Compilation Core Fault Alert</b>\n\n<code>${error.message}</code>`,
          parse_mode: 'HTML'
        })
      });
    } catch (tgErr) {
      console.error(tgErr);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Aether Lab Runtime Engine listening on port context: ${PORT}`));

module.exports = app;
