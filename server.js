const express = require('express');
const app = express();

// Enable strict JSON parsing middleware for incoming HTTP payloads
app.use(express.json());

const BOT_TOKEN = "8610031632:AAF9NwDwfgEokbz6cvg55jH7vFmL8_tEDvs";

// Root diagnostic endpoint to confirm server health and uptime status
app.get('/', (req, res) => {
  res.status(200).send("Aether Lab TG Core Operational Matrix // 24-7 Online");
});

// Dedicated Webhook Endpoint for direct instant delivery from Telegram
app.post(`/webhook/${BOT_TOKEN}`, async (req, res) => {
  // Return HTTP 200 immediately to acknowledge receipt and prevent request spam loops
  res.sendStatus(200);

  const update = req.body;
  if (!update || !update.message || !update.message.text) return;

  const msg = update.message;
  const parsedCleanText = msg.text.trim();
  const lowerText = parsedCleanText.toLowerCase();
  const targetChatId = msg.chat.id;
  let finalResponsePayloadText = "";

  // -------------------------------------------------------------------------
  // DETERMINISTIC RULES ROUTER (STRICT RULES ENGINE // NO AI FALLBACK)
  // -------------------------------------------------------------------------
  if (lowerText.includes('/start') || lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('সালাম')) {
    finalResponsePayloadText = `আসসালামু আলাইকুম <b>${msg.from.first_name || 'শিক্ষার্থী'}</b>! ক্যাডেট মিশন ক্লাসরুম অটো-বট পোর্টালে আপনাকে স্বাগত।\n\n• ফলাফল চেক করতে টাইপ করুন: <b>result</b>\n• পরীক্ষা ও ক্লাসের রুটিন দেখতে টাইপ করুন: <b>notice</b>`;
  } 
  else if (lowerText.includes('result') || lowerText.includes('রেজাল্ট') || lowerText.includes('মার্কশিট')) {
    finalResponsePayloadText = `<b>ক্যাডেট মিশন পঞ্চম শ্রেণী ফলাফল জেনারেটর:</b>\n\nমডেল পরীক্ষার মেধা তালিকা ও ডিজিটাল মার্কশিট সিস্টেমে আপলোড করা হয়েছে। নিচের লিংকে গিয়ে রোল ইনপুট দিন:\n\n👉 https://aether-lab.web.app/class5.html`;
  } 
  else if (lowerText.includes('notice') || lowerText.includes('নোটিশ') || lowerText.includes('রুটিন')) {
    finalResponsePayloadText = `<b>ক্যাডেট মিশন অফিশিয়াল নোটিশ আপডেট:</b>\n\n• <b>মডেল টেস্ট:</b> আগামী ১৪ই জুন রবিবার থেকে স্কুলভিত্তিক চূড়ান্ত মডেল টেস্ট শুরু হবে।\n• <b>প্রবেশপত্র:</b> ১২ই জুন বৃহস্পতিবারের মধ্যে প্রবেশপত্র সংগ্রহ করতে হবে।\n• <b>ফি:</b> মডেল ফি ৩০০/- টাকা।`;
  } 
  else {
    finalResponsePayloadText = `দুঃখিত <b>${msg.from.first_name || 'শিক্ষার্থী'}</b>, আপনার মেসেজটি বুঝতে পারিনি।\n\nসদয় তথ্যের জন্য দয়া করে শুধু <b>result</b> অথবা <b>notice</b> টাইপ করে মেসেজ দিন।`;
  }

  // Dispatch response data down to the Telegram REST API endpoint
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: finalResponsePayloadText,
        parse_mode: 'HTML'
      })
    });
  } catch (err) {
    console.error("Outbound webhook message broadcast failure:", err);
  }
});

// Initialize active instance listening port thresholds
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server node securely booted and listening on deployment port: ${PORT}`);
});
