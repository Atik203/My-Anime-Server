"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveExternalApiDataSchema = void 0;
const zod_1 = require("zod");
var Status;
(function (Status) {
    Status["Ongoing"] = "ongoing";
    Status["Completed"] = "completed";
})(Status || (Status = {}));
exports.saveExternalApiDataSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        episode: zod_1.z.string(),
        streamingLinks: zod_1.z.array(zod_1.z.object({
            source: zod_1.z.string(),
            server: zod_1.z.string(),
            link: zod_1.z.string(),
        })),
        releaseDate: zod_1.z.string(),
        slug: zod_1.z.string(),
        nextEpisode: zod_1.z.string().nullable(),
        previousEpisode: zod_1.z.string().nullable(),
        schedule: zod_1.z.object({
            day: zod_1.z.array(zod_1.z.string()),
        }),
        status: zod_1.z.nativeEnum(Status),
        isDeleted: zod_1.z.boolean().default(false),
        image: zod_1.z.string(),
    }),
});
