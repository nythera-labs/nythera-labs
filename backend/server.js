const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

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
  // We bounce the request to the client so the download happens on their home Wi-Fi IP,
  // bypassing the data-center ban on your Render server.
  const ghostUrl = `https://cobalt.tools/#${videoUrl}`;

  // Redirect the browser to the extraction page with the link pre-loaded
  res.redirect(ghostUrl);
});

app.listen(PORT, () => {
  console.log(`Aether Backend running on port ${PORT}`);
});
