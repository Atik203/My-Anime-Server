"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalApi = exports.externalApiSchema = void 0;
const mongoose_1 = require("mongoose");
exports.externalApiSchema = new mongoose_1.Schema({
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
    image: {
        type: String,
    },
    schedule: {
        day: {
            type: [String],
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});
exports.ExternalApi = (0, mongoose_1.model)('ExternalApi', exports.externalApiSchema);
