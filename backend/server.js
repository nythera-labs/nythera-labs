const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for cross-origin requests from your frontend
app.use(cors());
app.use(express.json());

// Keep-alive route for cron-job.org
app.get('/ping', (req, res) => {
  res.status(200).send('Pong! Aether Backend is awake.');
});

// Extraction Matrix: Media ripping route
app.get('/api/rip', async (req, res) => {
  try {
    const videoUrl = req.query.url; 
    
    if (!videoUrl) {
      return res.status(400).send('Extraction Matrix Failed: No video URL provided.');
    }

    // Force the browser to download the stream as an MP4 file
    res.header('Content-Disposition', 'attachment; filename="aether_extraction.mp4"');
    
    // Stream directly to the client
    ytdl(videoUrl, { format: 'mp4' }).pipe(res);

  } catch (error) {
    console.error('Extraction error:', error);
    res.status(500).send('Extraction Matrix Failed');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
