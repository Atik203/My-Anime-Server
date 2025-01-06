"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAnimeDetails = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const myAnimeLive_utils_1 = require("./myAnimeLive.utils");
// Helper to determine if a link is relevant
const isRelevantLink = (link) => {
    return (link.includes('dailymotion') ||
        link.includes('youtube') ||
        link.includes('ok.ru') ||
        link.includes('buibui'));
};
// Function to fetch anime details
const fetchAnimeDetails = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data: html } = yield axios_1.default.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
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
        const slugWithLastSlash = url
            .split('/') // example: /2024/12/10/wu-shen-zhu-zai-martial-master-episode-497-english-sub/
            .slice(3) // slice to keep only the path after /2024/12/10/
            .join('/')
            .replace(/-english-sub$/, ''); // Clean up the suffix
        const slug = slugWithLastSlash.replace(/\/$/, ''); // remove the / at the end of the slug
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
        const streamingLinks = [];
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
        const nextEpisode = yield (0, myAnimeLive_utils_1.getNextEpisode)(slugWithoutDate, episodeNumber + 1);
        const previousEpisode = yield (0, myAnimeLive_utils_1.getPreviousEpisode)(slugWithoutDate, episodeNumber - 1);
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching anime details:', error.message);
        }
        else {
            console.error('Error fetching anime details:', error);
        }
        return null;
    }
});
exports.fetchAnimeDetails = fetchAnimeDetails;
