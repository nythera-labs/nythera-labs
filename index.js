const express = require('express');
const app = express();

app.use(express.json());

// 🛡️ UNIVERSAL CORS MIDDLEWARE: Authorizes cross-site data streams for dashboard compatibility
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const BOT_TOKEN = "8610031632:AAF9NwDwfgEokbz6cvg55jH7vFmL8_tEDvs";
const DB_CODE_ENDPOINT = "https://api.npoint.io/E8d53f9c51e5b8d3b5ed";

// Root diagnostic link
app.get("/", (req, res) => {
  res.status(200).send("Aether Lab Vercel Serverless AI Bot Engine Active.");
});

// TUNNEL CHANNEL A: Receives base64 string from your iPad and saves it server-to-server into npoint
app.post("/api/save-code", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).send("Missing code parameter stream");

    const dbAction = await fetch(DB_CODE_ENDPOINT, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
app.get("/api/get-code", async (req, res) => {
  try {
    const dbResponse = await fetch(DB_CODE_ENDPOINT);
    if (!dbResponse.ok) return res.status(200).send(""); 
    const jsonOutput = await dbResponse.json();
    return res.status(200).send(jsonOutput.code || "");
  } catch (err) {
    return res.status(200).send("");
  }
});

// 🤖 MAIN WEBHOOK CHANNEL: Handles incoming messages and streams responses via Pollinations AI Core
app.post("/api/webhook", async (req, res) => {
  const update = req.body;
  
  // Guard clause: immediately dismiss empty updates or non-text messages to preserve execution parameters
  if (!update || !update.message || !update.message.text) {
    return res.sendStatus(200);
  }

  const msg = update.message;
  const originalText = msg.text.trim();
  const lowerText = originalText.toLowerCase();
  const targetChatId = msg.chat.id;
  
  let isPhotoAction = false;
  let finalResponsePayloadText = "";
  let targetMediaUrl = "";

  // -------------------------------------------------------------------------
  // DECK A: THE STRATIFIED CADET MISSION RULES MATRIX
  // -------------------------------------------------------------------------
  if (lowerText.includes("/start") || lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("সালাম")) {
    finalResponsePayloadText = "আসসালামু আলাইকুম <b>" + (msg.from.first_name || "শিক্ষার্থী") + "</b>! ক্যাডেট মিশন AI অটো-বট পোর্টালে আপনাকে স্বাগত।\n\n• ফলাফল চেক করতে টাইপ করুন: <b>result</b>\n• পরীক্ষা ও ক্লাসের রুটিন দেখতে টাইপ করুন: <b>notice</b>\n• এআই ছবি তৈরি করতে টাইপ করুন: <b>/image [আপনার কল্পনা]</b>\n\n• যেকোনো পড়ালেখার বা সাধারণ জ্ঞানের প্রশ্ন সরাসরি এখানে টাইপ করুন, আমাদের AI সাথে সাথে উত্তর দিয়ে দেবে!";
  } 
  else if (lowerText.includes("result") || lowerText.includes("রেজাল্ট") || lowerText.includes("মার্কশিট")) {
    finalResponsePayloadText = "<b>ক্যাডেট মিশন পঞ্চম শ্রেণী ফলাফল জেনারেটর:</b>\n\nমডেল পরীক্ষার মেধা তালিকা ও ডিজিটাল মার্কশিট সিস্টেমে আপলোড করা হয়েছে। নিচের লিংকে গিয়ে রোল ইনপুট দিন:\n\n👉 https://aether-lab.web.app/class5.html";
  } 
  else if (lowerText.includes("notice") || lowerText.includes("নোটিশ") || lowerText.includes("রুটিন")) {
    finalResponsePayloadText = "<b>ক্যাডেট মিশন অফিশিয়াল নোটিশ আপডেট:</b>\n\n• <b>মডেল টেস্ট:</b> আগামী ১৪ই জুন রবিবার থেকে স্কুলভিত্তিক চূড়ান্ত মডেল টেস্ট শুরু হবে।\n• <b>প্রবেশপত্র:</b> ১২ই জুন বৃহস্পতিবারের মধ্যে প্রবেশপত্র সংগ্রহ করতে হবে।\n• <b>ফি:</b> মডেল ফি ৩০০/- টাকা।";
  } 
  // -------------------------------------------------------------------------
  // DECK B: AI IMAGE GENERATION ENGINE COMMAND PIPELINE
  // -------------------------------------------------------------------------
  else if (lowerText.startsWith("/image ") || lowerText.startsWith("image ")) {
    let cleanPrompt = originalText.replace(/^\/image\s+/i, "").replace(/^image\s+/i, "").trim();
    
    if (!cleanPrompt) {
      finalResponsePayloadText = "❌ প্লিজ ইমেজ তৈরি করার জন্য একটি প্রম্পট/বর্ণনা দিন।\n\n<b>উদাহরণ:</b> <code>/image a futuristic cybernetic city neon lights</code>";
    } else {
      isPhotoAction = true;
      // Generates a dynamic random numeric seed parameter to completely bypass image cache logs
      let randomSeed = Math.floor(Math.random() * 999999);
      targetMediaUrl = "https://image.pollinations.ai/prompt/" + encodeURIComponent(cleanPrompt) + "?width=1024&height=1024&nologo=true&seed=" + randomSeed;
      finalResponsePayloadText = "🎨 <b>Generated Prompt:</b> <i>" + cleanPrompt + "</i>";
    }
  }
  // -------------------------------------------------------------------------
  // DECK C: LIVE AI CHAT CORE (POLLINATIONS TEXT INTERCEPT)
  // -------------------------------------------------------------------------
  else {
    try {
      const aiPayloadResponse = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { 
              role: "system", 
              content: "You are the official Aether Lab AI Assistant deployed for Cadet Mission Coaching Center (Class 5 Boys group) in Mymensingh, Bangladesh. You help primary school students understand math (unitary method, fractions, geometry), english grammar (parts of speech, tenses), and general knowledge. Keep answers highly accurate, polite, extremely short, clear, and very easy for a 10-year-old Class 5 student to read. Respond beautifully in Bengali or English based on the language they write to you in." 
            },
            { role: "user", content: originalText }
          ],
          model: "openai"
        })
      });

      finalResponsePayloadText = await aiPayloadResponse.text();
    } catch (aiError) {
      finalResponsePayloadText = "দুঃখিত, এই মুহূর্তে আমার এআই কোর নেটওয়ার্ক পোর্টে সাময়িক সমস্যা হচ্ছে। অনুগ্রহ করে কিছুক্ষণ পর আবার প্রশ্ন করুন।";
    }
  }

  // -------------------------------------------------------------------------
  // DECK D: OUTBOUND TELEGRAM REST GATEWAY ROUTING
  // -------------------------------------------------------------------------
  try {
    let apiMethodTarget = "sendMessage";
    let outboundBodyPayload = {
      chat_id: targetChatId,
      parse_mode: "HTML"
    };

    // Routing adapter shifts payload shapes dynamically if image tags are checked true
    if (isPhotoAction) {
      apiMethodTarget = "sendPhoto";
      outboundBodyPayload.photo = targetMediaUrl;
      outboundBodyPayload.caption = finalResponsePayloadText;
    } else {
      outboundBodyPayload.text = finalResponsePayloadText;
    }

    await fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/" + apiMethodTarget, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(outboundBodyPayload)
    });
  } catch (err) {
    console.error("Outbound relay failed to broadcast over Vercel lifecycle:", err);
  }

  // 🛡️ CRITICAL FOR VERCEL: Handshake terminates execution context only AFTER outbound network buffer clears
  res.sendStatus(200);
});

// ⚡ SERVERLESS MODULE HANDOFF EXPORT
module.exports = app;
