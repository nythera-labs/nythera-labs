const express = require('express');
const app = express();

// Parse json body segments automatically
app.use(express.json());

const BOT_TOKEN = "8610031632:AAF9NwDwfgEokbz6cvg55jH7vFmL8_tEDvs";

// Root diagnostic route to verify server health instantly
app.get('/', (req, res) => {
  res.status(200).send("Aether Lab Edge AI Core Live // 24-7 Autopilot Active");
});

// Main Webhook Route for Telegram Traffic Logs
app.post('/api/webhook', async (req, res) => {
  // Instantly return HTTP 200 response code to prevent delivery queue retries
  res.sendStatus(200);

  const update = req.body;
  if (!update || !update.message || !update.message.text) return;

  const msg = update.message;
  const originalText = msg.text.trim();
  const lowerText = originalText.toLowerCase();
  const targetChatId = msg.chat.id;
  let replyText = "";

  // -------------------------------------------------------------------------
  // DECK A: THE CADET MISSION RULES MATRIX (Instant Static Commands)
  // -------------------------------------------------------------------------
  if (lowerText.includes('/start') || lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('সালাম')) {
    replyText = `আসসালামু আলাইকুম <b>${msg.from.first_name || 'শিক্ষার্থী'}</b>! ক্যাডেট মিশন AI অটো-বট পোর্টালে আপনাকে স্বাগত।\n\n• ফলাফল চেক করতে টাইপ করুন: <b>result</b>\n• পরীক্ষা ও ক্লাসের রুটিন দেখতে টাইপ করুন: <b>notice</b>\n\n• যেকোনো পড়ালেখার বা সাধারণ জ্ঞানের প্রশ্ন সরাসরি এখানে টাইপ করুন, আমাদের AI সাথে সাথে উত্তর দিয়ে দেবে!`;
  } 
  else if (lowerText.includes('result') || lowerText.includes('রেজাল্ট') || lowerText.includes('মার্কশিট')) {
    replyText = `<b>ক্যাডেট মিশন পঞ্চম শ্রেণী ফলাফল জেনারেটর:</b>\n\nমডেল পরীক্ষার মেধা তালিকা ও ডিজিটাল মার্কশিট সিস্টেমে আপলোড করা হয়েছে। নিচের লিংকে গিয়ে রোল ইনপুট দিন:\n\n👉 https://aether-lab.web.app/class5.html`;
  } 
  else if (lowerText.includes('notice') || lowerText.includes('নোটিশ') || lowerText.includes('রুটিন')) {
    replyText = `<b>ক্যাডেট মিশন অফিশিয়াল নোটিশ আপডেট:</b>\n\n• <b>মডেল টেস্ট:</b> আগামী ১৪ই জুন রবিবার থেকে স্কুলভিত্তিক চূড়ান্ত মডেল টেস্ট শুরু হবে।\n• <b>প্রবেশপত্র:</b> ১২ই জুন বৃহস্পতিবারের মধ্যে প্রবেশপত্র সংগ্রহ করতে হবে।\n• <b>ফি:</b> মডেল ফি ৩০০/- টাকা।\n\n[স্কুল লিস্ট: ১. প্রিমিয়াম আইডিয়াল হাই স্কুল, ২. আফরোজ খান, ৩. ক্যান্টনমেন্ট পাবলিক, ৪. প্রগ্রেসিভ, ৫. মুকুল নিকেতন হাই স্কুল, ৬. গভঃ ল্যাবরেটরি]`;
  } 
  
  // -------------------------------------------------------------------------
  // DECK B: FIXED BYPASS GET PIPELINE (POLLINATIONS AI CHAT CORE)
  // -------------------------------------------------------------------------
  else {
    try {
      const systemInstruction = "You are the official Aether Lab AI Assistant deployed for Cadet Mission Coaching Center (Class 5 Boys group) in Mymensingh, Bangladesh. You help primary school students understand math, english grammar, and general knowledge. Keep answers highly accurate, polite, extremely short, clear, and very easy for a 10-year-old student to read. Respond beautifully in Bengali or English based on the language they write to you in.";
      
      // Using an anonymous clean GET parameter stream completely bypasses Vercel's shared cloud IP POST queue restrictions
      const queryEndpoint = `https://text.pollinations.ai/${encodeURIComponent(originalText)}?system=${encodeURIComponent(systemInstruction)}&model=openai`;
      
      const aiResponse = await fetch(queryEndpoint);
      const aiTextResult = await aiResponse.text();
      
      // FRAME SYSTEM GUARD FILTER: If the cloud endpoint returns any JSON system error packet, drop it cleanly
      if (!aiResponse.ok || aiTextResult.includes('"error":') || aiTextResult.startsWith('{')) {
        replyText = `দুঃখিত <b>${msg.from.first_name || 'শিক্ষার্থী'}</b>, এই মুহূর্তে আমার এআই মেমোরি পোর্টে চাপ বেশি। অনুগ্রহ করে ১ মিনিট পর আবার প্রশ্নটি করুন।`;
      } else {
        replyText = aiTextResult;
      }
    } catch (err) {
      console.error("AI edge exception encounter:", err);
      replyText = `দুঃখিত, নেটওয়ার্ক সংযোগে সাময়িক ত্রুটি হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।`;
    }
  }

  // Dispatch final formatted text block back to user's Telegram thread
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: replyText,
        parse_mode: 'HTML'
      })
    });
  } catch (err) {
    console.error("Outbound API communication failure:", err);
  }
});

// Configure listening environments
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Aether Lab Core Live on Port context: ${PORT}`));

module.exports = app;
