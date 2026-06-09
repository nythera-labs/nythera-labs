const express = require('express');
const app = express();

app.use(express.json());

// 🛡️ UNIVERSAL CORS MIDDLEWARE: Authorizes cross-site data streams so your browser never blocks requests
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
// Wired directly to your working, verified cloud JSON storage bin
const DB_CODE_ENDPOINT = "https://api.npoint.io/e8d53f9c51e5b8d3b5ed";

// Root diagnostic link
app.get('/', (req, res) => {
  res.status(200).send("Aether Lab Edge Secure Script Interpreter Node Active.");
});

// TUNNEL CHANNEL A: Receives base64 string from your iPad and saves it server-to-server into npoint
app.post('/api/save-code', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).send("Missing code parameter stream");

    const dbAction = await fetch(DB_CODE_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })
    });

    if (dbAction.ok) {
      return res.status(200).send("OK");
    } else {
      const dbErrText = await dbAction.text();
      return res.status(500).send("Database rejected write: " + dbErrText);
    }
  } catch (err) {
    return res.status(500).send("Tunnel execution error: " + err.message);
  }
});

// TUNNEL CHANNEL B: Pulls the encrypted string from npoint to populate your iPad code container view
app.get('/api/get-code', async (req, res) => {
  try {
    const dbResponse = await fetch(DB_CODE_ENDPOINT);
    if (!dbResponse.ok) return res.status(200).send(""); 
    const jsonOutput = await dbResponse.json();
    return res.status(200).send(jsonOutput.code || "");
  } catch (err) {
    return res.status(200).send("");
  }
});

// Main Webhook Routing Pipeline for incoming Telegram messages
app.post('/api/webhook', async (req, res) => {
  res.sendStatus(200);

  const update = req.body;
  if (!update || !update.message || (!update.message.text && !update.message.photo)) return;

  const msg = update.message;
  const originalText = msg.text ? msg.text.trim() : "";
  const lowerText = originalText.toLowerCase();
  const targetChatId = msg.chat.id;

  try {
    const dbQueryResponse = await fetch(DB_CODE_ENDPOINT);
    if (!dbQueryResponse.ok) throw new Error("Cloud script database payload dropped.");
    
    const jsonOutput = await dbQueryResponse.json();
    const base64EncryptedCodeDataString = jsonOutput.code;

    if (!base64EncryptedCodeDataString || base64EncryptedCodeDataString.trim() === "") {
      throw new Error("No script string file loaded inside active runtime memory cells.");
    }

    const customInjectedJavaScriptCodeString = Buffer.from(base64EncryptedCodeDataString.trim(), 'base64').toString('utf-8');

    const AsyncFunctionConstructor = Object.getPrototypeOf(async function(){}).constructor;
    const executeLiveInjectedScriptNode = new AsyncFunctionConstructor(
      'msg', 'originalText', 'lowerText', 'targetChatId', 'BOT_TOKEN', 
      customInjectedJavaScriptCodeString
    );

    await executeLiveInjectedScriptNode(msg, originalText, lowerText, targetChatId, BOT_TOKEN);

  } catch (error) {
    console.error("Compilation execution dropout exception:", error);
    try {
      await fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: "⚠️ <b>Aether Lab Compilation Core Fault Alert</b>\n\n<code>" + error.message + "</code>",
          parse_mode: 'HTML'
        })
      });
    } catch (tgErr) {
      console.error(tgErr);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Aether Lab Runtime Engine listening on port context: " + PORT));

module.exports = app;
