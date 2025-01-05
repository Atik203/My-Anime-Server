import cors from 'cors';
import express from 'express';
import { fetchAnimeDetails } from './scaper';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Route to scrape anime details
app.get('/anime', async (req, res) => {
  const { url } = req.query;

  // Validate input
  if (!url || typeof url !== 'string') {
    return res
      .status(400)
      .json({ error: 'Invalid URL. Please provide a valid anime page URL.' });
  }

  // Scrape anime details
  const animeDetails = await fetchAnimeDetails(url);
  if (!animeDetails) {
    return res.status(500).json({
      error: 'Failed to fetch anime details. Please try again later.',
    });
  }

  res.json(animeDetails);
});

// Start the server
app.listen(5000, () => {
  console.log(`Server is running on http://localhost:${5000}`);
});
