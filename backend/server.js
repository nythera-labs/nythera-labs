const express = require('express');
const ytDl = require('yt-dlp-exec');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/ping', (req, res) => res.send('Pong!'));

// 🚀 The New Private Extraction API
app.get('/api/rip', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing URL');

  try {
    // This fetches the direct MP4 stream URL without downloading the whole file
    const data = await ytDl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      format: 'best',
    });

    // Send the direct, high-quality stream URL back to your frontend
    res.json({
      title: data.title,
      streamUrl: data.url
    });
  } catch (err) {
    res.status(500).send('Extraction failed: ' + err.message);
  }
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
