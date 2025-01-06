import axios from 'axios';
import * as cheerio from 'cheerio';

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

    const $ = cheerio.load(response.data);
    const episodeLink = $('h2.entry-header-title a').attr('href');
    if (episodeLink) {
      return episodeLink;
      // Extract the slug from the episode link
      //   const slugMatch = episodeLink.match(/\/(\d{4}\/\d{2}\/\d{2}\/[^/]+)\/$/);
      //   if (slugMatch && slugMatch[1]) {
      //     const slug = slugMatch[1];
      //     console.log('extracted slug', slug);
      //     return `${slug}`;
      //   }
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
  const searchQuery = `${slug.replace(/episode-\d+/, `episode-${episodeNumber}`)}`;
  const searchUrl = `https://myanime.live/?s=${searchQuery}`;
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
  const searchQuery = `${slug.replace(/episode-\d+/, `episode-${episodeNumber}`)}`;
  const searchUrl = `https://myanime.live/?s=${searchQuery}`;
  const episodeExists = await validateEpisode(searchUrl);
  if (episodeExists) {
    return episodeExists;
  }

  return null;
};
