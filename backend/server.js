const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Basic health check endpoint
app.get('/', (req, res) => {
    res.send('Aether Backend is running successfully.');
});

// If you need a replacement for video processing, 
// you would add your new logic here, for example:
// app.get('/video-info', async (req, res) => {
//    // Add your new yt-dlp-exec logic here
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
