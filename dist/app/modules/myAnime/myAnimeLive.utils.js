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
exports.getPreviousEpisode = exports.getNextEpisode = exports.validateEpisode = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const config_1 = __importDefault(require("../../config"));
// Validate if episode exists
const validateEpisode = (searchUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });
        const $ = cheerio.load(response.data);
        const episodeLink = $('h2.entry-header-title a').attr('href');
        if (episodeLink) {
            const newSlug = episodeLink.replace(/\/$/, '');
            return newSlug;
            // const slugMatch = episodeLink.match(/\/(\d{4}\/\d{2}\/\d{2}\/[^/]+)\/$/);
            // if (slugMatch && slugMatch[1]) {
            //   const slug = slugMatch[1];
            //   // remove the / at the end of the slug
            // remove the / at the end of the slug
            //   return `${newSlug}`;
            // }
        }
        return null;
    }
    catch (error) {
        const errorMessage = error.message;
        console.error('Error validating episode:', errorMessage);
        return null;
    }
});
exports.validateEpisode = validateEpisode;
// Get next episode
const getNextEpisode = (slug, episodeNumber) => __awaiter(void 0, void 0, void 0, function* () {
    let ep = episodeNumber.toString();
    if (episodeNumber < 10) {
        ep = ep.padStart(2, '0');
    }
    const searchQuery = `${slug.replace(/episode-\d+/, `episode-${ep}`)}`;
    const searchUrl = `${config_1.default.my_anime_live_url}/?s=${searchQuery}`;
    const episodeExists = yield (0, exports.validateEpisode)(searchUrl);
    if (episodeExists) {
        return episodeExists;
    }
    return null;
});
exports.getNextEpisode = getNextEpisode;
// Get previous episode
const getPreviousEpisode = (slug, episodeNumber) => __awaiter(void 0, void 0, void 0, function* () {
    let ep = episodeNumber.toString();
    if (episodeNumber < 10) {
        ep = ep.padStart(2, '0');
    }
    const searchQuery = `${slug.replace(/episode-\d+/, `episode-${ep}`)}`;
    const searchUrl = `${config_1.default.my_anime_live_url}/?s=${searchQuery}`;
    const episodeExists = yield (0, exports.validateEpisode)(searchUrl);
    if (episodeExists) {
        return episodeExists;
    }
    return null;
});
exports.getPreviousEpisode = getPreviousEpisode;
