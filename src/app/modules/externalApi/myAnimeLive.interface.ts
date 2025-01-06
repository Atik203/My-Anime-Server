export interface AnimeDetails {
  title: string;
  description: string;
  episode: string;
  streamingLinks: { source: string; server: string; link: string }[];
  releaseDate: string;
  slug: string;
  nextEpisode: string | null;
  previousEpisode: string | null;
}
