import { model, Schema } from 'mongoose';
import { TExternalAPi } from '../myAnime/myAnimeLive.interface';

export const externalApiSchema = new Schema<TExternalAPi>(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    episode: {
      type: String,
    },
    streamingLinks: [
      {
        source: {
          type: String,
        },
        server: {
          type: String,
        },
        link: {
          type: String,
        },
      },
    ],
    releaseDate: {
      type: String,
    },
    slug: {
      type: String,
    },
    nextEpisode: {
      type: String,
    },
    previousEpisode: {
      type: String,
    },
    schedule: {
      day: {
        type: [String],
      },
      time: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export const ExternalApi = model<TExternalAPi>(
  'ExternalApi',
  externalApiSchema,
);
