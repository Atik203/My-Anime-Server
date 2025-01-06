import { Types } from 'mongoose';

export interface TAnimeDetails {
  title: string;
  description: string;
  episode: string;
  streamingLinks: { source: string; server: string; link: string }[];
  releaseDate: string;
  slug: string;
  nextEpisode: string | null;
  previousEpisode: string | null;
}

export interface TExternalAPi extends TAnimeDetails {
  schedule: { day: string[] };
  status: 'ongoing' | 'completed';
  isDeleted: boolean;
  user: Types.ObjectId;
  image: string;
}
