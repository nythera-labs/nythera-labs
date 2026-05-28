const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 🟢 Keep-Alive Route for cron-job.org
app.get('/ping', (req, res) => {
  res.status(200).send('Pong! Aether Backend is wide awake.');
});

// 🔴 The Extraction Matrix
app.get('/api/rip', async (req, res) => {
  try {
    const videoUrl = req.query.url; 
    
    if (!videoUrl) {
      return res.status(400).send('Extraction Matrix Error: No video URL provided.');
    }

    // Force the browser to download the file instead of playing it
    res.header('Content-Disposition', 'attachment; filename="Aether_Extraction.mp4"');
    
    // Rip and stream the video directly to the client, WITH error handling
    ytdl(videoUrl, { format: 'mp4' })
      .on('error', (err) => {
        console.error('YouTube Stream Error:', err.message);
        // Only send an error response if the download hasn't already started
        if (!res.headersSent) {
          res.status(429).send('Extraction Matrix Failed: YouTube blocked the request (HTTP 429).');
        }
      })
      .pipe(res);

  } catch (error) {
    console.error('Extraction error:', error);
    if (!res.headersSent) {
      res.status(500).send('Extraction Matrix Failed: Could not process the video.');
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Aether Backend running on port ${PORT}`);
});
