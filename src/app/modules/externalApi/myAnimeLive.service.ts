import axios from 'axios';
import * as cheerio from 'cheerio';
import { AnimeDetails } from './myAnimeLive.interface';
import { getNextEpisode, getPreviousEpisode } from './myAnimeLive.utils';

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

    const description = (() => {
      const pTag = $('div.entry-content p').eq(2); // Select the third <p> tag (index starts from 0)
      pTag.find('mark.has-inline-color.has-vivid-cyan-blue-color').remove(); // Remove the <mark> tag
      return pTag.text().trim() || 'No Description';
    })();
    const releaseDate = $('time.entry-date').attr('datetime') || '';

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

    // Extract title from the URL or slug after the date part
    const title = slug
      .split('/')
      .slice(3)
      .join(' ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    // Extract episode number from the URL
    const episodeMatch = url.match(/episode-(\d+)/i);
    const episode = episodeMatch
      ? `Episode ${episodeMatch[1]}`
      : 'Unknown Episode';

    // Scrape streaming links
    const streamingLinks: { source: string; server: string; link: string }[] =
      [];
    $('iframe').each((_, element) => {
      const src = $(element).attr('src');
      if (src && isRelevantLink(src)) {
        const server = src.includes('dailymotion')
          ? 'dailymotion'
          : src.includes('youtube')
            ? 'youtube'
            : src.includes('ok.ru')
              ? 'ok.ru'
              : src.includes('buibui')
                ? 'buibui'
                : 'unknown';
        streamingLinks.push({
          source: `Server ${server.charAt(0).toUpperCase() + server.slice(1)}`,
          server,
          link: src.startsWith('//') ? `https:${src}` : src,
        });
      }
    });

    // Format release date to only include the date (no time)
    const formattedReleaseDate = releaseDateObj.toISOString().split('T')[0]; // Example: "2025-01-05"

    // Ensure episodeMatch is defined and extract the episode number
    if (!episodeMatch || episodeMatch.length < 2) {
      throw new Error('Episode number not found in URL');
    }
    const episodeNumber = parseInt(episodeMatch[1]);

    // Extract the relevant part of the slug for searching
    const slugWithoutDate = slug.split('/').slice(3).join('/');

    // Validate next and previous episodes
    const nextEpisode = await getNextEpisode(
      slugWithoutDate,
      episodeNumber + 1,
    );
    const previousEpisode = await getPreviousEpisode(
      slugWithoutDate,
      episodeNumber - 1,
    );

    return {
      title,
      description,
      episode,
      streamingLinks,
      releaseDate: formattedReleaseDate,
      slug,
      nextEpisode,
      previousEpisode,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching anime details:', error.message);
    } else {
      console.error('Error fetching anime details:', error);
    }
    return null;
  }
};
