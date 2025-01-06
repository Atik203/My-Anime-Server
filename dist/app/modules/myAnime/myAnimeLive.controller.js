"use strict";
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
exports.myAnimeLiveController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const myAnimeLive_service_1 = require("./myAnimeLive.service");
exports.myAnimeLiveController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.query;
    if (!url) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_1.default.BAD_REQUEST,
            message: 'URL is required',
            data: null,
        });
        return;
    }
    const animeDetails = yield (0, myAnimeLive_service_1.fetchAnimeDetails)(url);
    if (!animeDetails) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: 'Error fetching anime details',
            data: null,
        });
        return;
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Anime details fetched successfully',
        data: animeDetails,
    });
}));
