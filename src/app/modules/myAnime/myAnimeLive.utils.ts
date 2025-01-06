import axios from 'axios';
import * as cheerio from 'cheerio';
import config from '../../config';

// Validate if episode exists
export const validateEpisode = async (
  searchUrl: string,
): Promise<string | null> => {
  try {
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    console.log('search url:', searchUrl);
    const $ = cheerio.load(response.data);
    const episodeLink = $('h2.entry-header-title a').attr('href');
    console.log('episode link:', episodeLink);
    if (episodeLink) {
      const slugMatch = episodeLink.match(/\/(\d{4}\/\d{2}\/\d{2}\/[^/]+)\/$/);
      if (slugMatch && slugMatch[1]) {
        const slug = slugMatch[1];
        // remove the / at the end of the slug

        const newSlug = slug.replace(/\/$/, ''); // remove the / at the end of the slug

        return `${newSlug}`;
      }
    }
    return null;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error('Error validating episode:', errorMessage);
    return null;
  }
};

// Get next episode
export const getNextEpisode = async (
  slug: string,
  episodeNumber: number,
): Promise<string | null> => {
  let ep = episodeNumber.toString();
  if (episodeNumber < 10) {
    ep = ep.padStart(2, '0');
  }
  const searchQuery = `${slug.replace(/episode-\d+/, `episode-${ep}`)}`;
  const searchUrl = `${config.my_anime_live_url}/?s=${searchQuery}`;
  const episodeExists = await validateEpisode(searchUrl);
  if (episodeExists) {
    return episodeExists;
  }

  return null;
};

// Get previous episode
export const getPreviousEpisode = async (
  slug: string,
  episodeNumber: number,
): Promise<string | null> => {
  let ep = episodeNumber.toString();
  if (episodeNumber < 10) {
    ep = ep.padStart(2, '0');
  }

  const searchQuery = `${slug.replace(/episode-\d+/, `episode-${ep}`)}`;
  const searchUrl = `${config.my_anime_live_url}/?s=${searchQuery}`;
  const episodeExists = await validateEpisode(searchUrl);
  if (episodeExists) {
    return episodeExists;
  }

  return null;
};
