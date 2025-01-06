import { z } from 'zod';

enum Status {
  Ongoing = 'ongoing',
  Completed = 'completed',
}

export const saveExternalApiDataSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    episode: z.string(),
    streamingLinks: z.array(
      z.object({
        source: z.string(),
        server: z.string(),
        link: z.string(),
      }),
    ),
    releaseDate: z.string(),
    slug: z.string(),
    nextEpisode: z.string().nullable(),
    previousEpisode: z.string().nullable(),
    schedule: z.object({
      day: z.array(z.string()),
      time: z.string(),
    }),
    status: z.nativeEnum(Status),
    isDeleted: z.boolean().default(false),
  }),
});
