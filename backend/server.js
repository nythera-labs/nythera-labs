const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 🟢 Keep-Alive Route for cron-job.org
app.get('/ping', (req, res) => {
  res.status(200).send(`Pong! Aether Backend is wide awake.`);
});

// 🔴 The Stealth Extraction Matrix (Ghost Routing Edition)
app.get('/api/rip', (req, res) => {
  const videoUrl = req.query.url; 
  
  if (!videoUrl) {
    return res.status(400).send(`Extraction Matrix Error: No video URL provided.`);
  }

  // GHOST ROUTING: 
  // Since Cloudflare blocks Render's Server IP, we bounce the request 
  // to your iPad so you use your safe home Wi-Fi IP instead.
  const ghostUrl = `https://cobalt.tools/#${videoUrl}`;

  // Instantly teleport the browser to the pre-filled extraction page
  res.redirect(ghostUrl);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Aether Backend running on port ${PORT}`);
});
