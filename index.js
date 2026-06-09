const express = require('express');
const app = express();

app.use(express.json());

const BOT_TOKEN = "8610031632:AAF9NwDwfgEokbz6cvg55jH7vFmL8_tEDvs";
const DB_CODE_ENDPOINT = "https://kvdb.io/aether_lab_cfg_8610031632/bot_live_code_v3";

app.get('/', (req, res) => {
  res.status(200).send("Aether Lab Edge Script Interpreter Node Active.");
});

app.post('/api/webhook', async (req, res) => {
  res.sendStatus(200); // Instantly discharge transaction threads pipelines

  const update = req.body;
  if (!update || !update.message || !update.message.text) return;

  const msg = update.message;
  const originalText = msg.text.trim();
  const lowerText = originalText.toLowerCase();
  const targetChatId = msg.chat.id;

  try {
    // 1. Fetch your live executable javascript code string array straight from database
    const dbQueryResponse = await fetch(DB_CODE_ENDPOINT);
    if (!dbQueryResponse.ok) throw new Error("Cloud script registry unreachable.");
    const customInjectedJavaScriptCodeString = await dbQueryResponse.text();

    // 2. Initialize a native JavaScript AsyncFunction execution compiler constructor cell
    const AsyncFunctionConstructor = Object.getPrototypeOf(async function(){}).constructor;
    
    // 3. Compile the user code string into an active runtime function thread closure mapping block
    const executeLiveInjectedScriptNode = new AsyncFunctionConstructor(
      'msg', 
      'originalText', 
      'lowerText', 
      'targetChatId', 
      'BOT_TOKEN', 
      customInjectedJavaScriptCodeString
    );

    // 4. Fire execution pipeline layers
    await executeLiveInjectedScriptNode(msg, originalText, lowerText, targetChatId, BOT_TOKEN);

  } catch (error) {
    console.error("Compilation / Execution fault trace encounter:", error);
    
    // FAULTS REPORT PROTOCOL SYSTEM: If you write broken script logic on your iPad, it messages you the fault stack description!
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: `⚠️ <b>Aether Lab Compilation Core Fault Alert</b>\n\n<code>${error.message}</code>\n\nCheck code syntax layout lines matching your iPad text window configuration inputs.`,
          parse_mode: 'HTML'
        })
      });
    } catch (tgErr) {
      console.error("Fatal status trace fault output logging failed:", tgErr);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Aether Lab Runtime Engine listening on port context: ${PORT}`));

module.exports = app;
