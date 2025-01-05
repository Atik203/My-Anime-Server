import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { routeNotFound } from './app/middleware/routeNotFound';
import router from './app/routes';
import { fetchAnimeDetails } from './app/utils/scraper';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true, // allow cookies from the client
  }),
);

// Routes
app.use('/api/v1', router);

app.get('/', async (req: Request, res: Response) => {
  res.send('Server is running...');
});

app.get('/api/v1/anime', async (req, res) => {
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

// 404 Route
app.use('*', routeNotFound);

// Error Handler
app.use(globalErrorHandler);

export default app;
