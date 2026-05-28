const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🟢 Keep-Alive (Cron Job stays green)
app.get('/ping', (req, res) => {
  res.status(200).send(`Pong! Aether Backend is wide awake.`);
});

// 🔴 The Stealth Ghost Router
app.get('/api/rip', (req, res) => {
  const videoUrl = req.query.url; 
  if (!videoUrl) {
    return res.status(400).send(`Missing video URL.`);
  }

  // Instead of fetching the video on the server (and getting banned),
  // we bounce the user to a specialized downloader with the link pre-loaded.
  const ghostUrl = `https://savefrom.net/${videoUrl}`;

  res.redirect(ghostUrl);
});

app.listen(PORT, () => {
  console.log(`Backend live on port ${PORT}`);
});
