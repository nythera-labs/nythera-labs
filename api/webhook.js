export default async function handler(req, res) {
  // Guard clause against non-POST requests from unauthorized scans
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const BOT_TOKEN = "8610031632:AAF9NwDwfgEokbz6cvg55jH7vFmL8_tEDvs";
  const update = req.body;

  // Verify the packet architecture is valid before allocating computing resources
  if (!update || !update.message || !update.message.text) {
    return res.status(200).send('Payload Empty');
  }

  const msg = update.message;
  const parsedCleanText = msg.text.trim();
  const lowerText = parsedCleanText.toLowerCase();
  const targetChatId = msg.chat.id;
  let finalResponsePayloadText = "";

  // -------------------------------------------------------------------------
  // DECK A: THE STRATIFIED CADET MISSION RULES MATRIX
  // -------------------------------------------------------------------------
  if (lowerText.includes('/start') || lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('সালাম')) {
    finalResponsePayloadText = `আসসালামু আলাইকুম <b>${msg.from.first_name || 'শিক্ষার্থী'}</b>! ক্যাডেট মিশন AI অটো-বট পোর্টালে আপনাকে স্বাগত।\n\n• ফলাফল চেক করতে টাইপ করুন: <b>result</b>\n• পরীক্ষা ও ক্লাসের রুটিন দেখতে টাইপ করুন: <b>notice</b>\n\n• যেকোনো পড়ালেখার বা সাধারণ জ্ঞানের প্রশ্ন সরাসরি এখানে টাইপ করুন, আমাদের AI সাথে সাথে উত্তর দিয়ে দেবে!`;
  } 
  else if (lowerText.includes('result') || lowerText.includes('রেজাল্ট') || lowerText.includes('মার্কশিট')) {
    finalResponsePayloadText = `<b>ক্যাডেট মিশন পঞ্চম শ্রেণী ফলাফল জেনারেটর:</b>\n\nমডেল পরীক্ষার মেধা তালিকা ও ডিজিটাল মার্কশিট সিস্টেমে আপলোড করা হয়েছে। নিচের লিংকে গিয়ে রোল ইনপুট দিন:\n\n👉 https://aether-lab.web.app/class5.html`;
  } 
  else if (lowerText.includes('notice') || lowerText.includes('নোটিশ') || lowerText.includes('রুটিন')) {
    finalResponsePayloadText = `<b>ক্যাডেট মিশন অফিশিয়াল নোটিশ আপডেট:</b>\n\n• <b>মডেল টেস্ট:</b> আগামী ১৪ই জুন রবিবার থেকে স্কুলভিত্তিক চূড়ান্ত মডেল টেস্ট শুরু হবে।\n• <b>প্রবেশপত্র:</b> ১২ই জুন বৃহস্পতিবারের মধ্যে প্রবেশপত্র সংগ্রহ করতে হবে।\n• <b>ফি:</b> মডেল ফি ৩০০/- টাকা।`;
  } 
  
  // -------------------------------------------------------------------------
  // DECK B: LIVE FALLBACK EDGE CHAT CORE via POLLINATIONS AI
  // -------------------------------------------------------------------------
  else {
    try {
      const aiPayloadResponse = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { 
              role: 'system', 
              content: 'You are the official Aether Lab AI Assistant deployed for Cadet Mission Coaching Center (Class 5 Boys group) in Mymensingh, Bangladesh. You help primary school students understand math (unitary method, fractions, geometry), english grammar (parts of speech, tenses), and general knowledge. Keep answers highly accurate, polite, extremely short, clear, and very easy for a 10-year-old Class 5 student to read. Respond beautifully in Bengali or English based on the language they write to you in.' 
            },
            { role: 'user', content: parsedCleanText }
          ],
          model: 'openai'
        })
      });

      finalResponsePayloadText = await aiPayloadResponse.text();
    } catch (aiError) {
      finalResponsePayloadText = `দুঃখিত, এই মুহূর্তে আমার এআই কোর নেটওয়ার্ক পোর্টে সাময়িক সমস্যা হচ্ছে। অনুগ্রহ করে কিছুক্ষণ পর আবার প্রশ্ন করুন।`;
    }
  }

  // -------------------------------------------------------------------------
  // DECK C: OUTBOUND REST GATEWAY PAYLOAD ROUTING
  // -------------------------------------------------------------------------
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
    console.error("Outbound relay failed to broadcast over Vercel lifecycle:", err);
  }

  // Instantly close the execution loop context to keep consumption rates clean
  return res.status(200).send('Webhook Processed Cleanly');
}
