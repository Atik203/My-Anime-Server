import axios from 'axios';
import * as cheerio from 'cheerio';

// Interface for the anime details
interface AnimeDetails {
  title: string;
  description: string;
  streamingLinks: { source: string; link: string }[];
  releaseDate: string;
  slug: string;
  nextEpisode: string | null;
  previousEpisode: string | null;
}

// Helper to determine if a link is relevant
const isRelevantLink = (link: string): boolean => {
  return (
    link.includes('dailymotion') ||
    link.includes('youtube') ||
    link.includes('ok.ru') ||
    link.includes('buibui')
  );
};

// Function to fetch anime details
export const fetchAnimeDetails = async (
  url: string,
): Promise<AnimeDetails | null> => {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(html, null, false);

    // Scrape title, description, and release date
    const title = $('h1.entry-title').text().trim() || 'Unknown Title';
    const description =
      $('div.entry-content > p').first().text().trim() || 'No Description';
    const releaseDate = $('time.entry-date').attr('datetime') || '';
    console.log('Release Date:', releaseDate); // Log the release date for debugging

    // Parse the release date directly from the datetime attribute
    const releaseDateObj = new Date(releaseDate);
    if (isNaN(releaseDateObj.getTime())) {
      throw new Error('Invalid date value');
    }

    const slug = url
      .split('/') // example: /2024/12/10/wu-shen-zhu-zai-martial-master-episode-497-english-sub/
      .slice(3) // slice to keep only the path after /2024/12/10/
      .join('/')
      .replace(/-english-sub$/, ''); // Clean up the suffix

    // Scrape streaming links
    const streamingLinks: { source: string; link: string }[] = [];
    $('iframe').each((_, element) => {
      const src = $(element).attr('src');
      if (src && isRelevantLink(src)) {
        const source = src.includes('dailymotion')
          ? 'Dailymotion'
          : src.includes('youtube')
            ? 'YouTube'
            : src.includes('ok.ru')
              ? 'OK.ru'
              : src.includes('buibui')
                ? 'Buibui'
                : 'Unknown';
        streamingLinks.push({
          source: `Server ${source}`,
          link: src.startsWith('//') ? `https:${src}` : src,
        });
      }
    });

    // Format release date to only include the date (no time)
    const formattedReleaseDate = releaseDateObj.toISOString().split('T')[0]; // Example: "2025-01-05"

    // Construct next and previous episode slugs
    const nextEpisodeDate = new Date(releaseDateObj);
    nextEpisodeDate.setDate(nextEpisodeDate.getDate() + 1);

    const previousEpisodeDate = new Date(releaseDateObj);
    previousEpisodeDate.setDate(previousEpisodeDate.getDate() - 1);

    const formatSlug = (date: Date): string => {
      const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
      return `/${formattedDate}/${slug}`;
    };

    // Validate next and previous episodes
    const nextEpisode = await getNextEpisode(formatSlug(nextEpisodeDate));
    const previousEpisode = await getPreviousEpisode(
      formatSlug(previousEpisodeDate),
    );

    return {
      title,
      description,
      streamingLinks,
      releaseDate: formattedReleaseDate,
      slug,
      nextEpisode,
      previousEpisode,
    };
  } catch (error) {
    console.error('Error fetching anime details:', error.message);
    return null;
  }
};

// Get next episode by checking up to 10 days
const getNextEpisode = async (slug: string): Promise<string | null> => {
  for (let i = 0; i < 10; i++) {
    const nextEpisodeSlug = `${slug}`;
    const episodeExists = await validateEpisode(nextEpisodeSlug);
    if (episodeExists) {
      return nextEpisodeSlug;
    }
    // Move to the next day
    const nextDate = new Date(slug.split('/')[1]);
    nextDate.setDate(nextDate.getDate() + 1);
    slug = `${nextDate.getFullYear()}/${(nextDate.getMonth() + 1).toString().padStart(2, '0')}/${nextDate.getDate().toString().padStart(2, '0')}/${slug.split('/')[3]}`;
  }
  return 'Episode is not released yet';
};

// Get previous episode by checking up to 10 days
const getPreviousEpisode = async (slug: string): Promise<string | null> => {
  for (let i = 0; i < 10; i++) {
    const previousEpisodeSlug = `${slug}`;
    const episodeExists = await validateEpisode(previousEpisodeSlug);
    if (episodeExists) {
      return previousEpisodeSlug;
    }
    // Move to the previous day
    const previousDate = new Date(slug.split('/')[1]);
    previousDate.setDate(previousDate.getDate() - 1);
    slug = `${previousDate.getFullYear()}/${(previousDate.getMonth() + 1).toString().padStart(2, '0')}/${previousDate.getDate().toString().padStart(2, '0')}/${slug.split('/')[3]}`;
  }
  return 'Episode is not released yet';
};

// Validate if episode exists
const validateEpisode = async (slug: string): Promise<string | null> => {
  try {
    const url = `https://myanime.live${slug}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    if (response.status === 200) {
      return slug;
    }
    return null;
  } catch {
    return null;
  }
};
