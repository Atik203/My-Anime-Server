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
Object.defineProperty(exports, "__esModule", { value: true });
exports.externalApiController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const externalApi_service_1 = require("./externalApi.service");
const saveExternalApi = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const user = req.user;
    const result = yield externalApi_service_1.externalApiService.saveExternalApiData(data, user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: 'Data saved successfully',
        data: result,
    });
}));
const getUserExternalApiData = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield externalApi_service_1.externalApiService.getUserExternalApiData(user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: 'Data fetched successfully',
        data: result,
    });
}));
const getSingleExternalApiData = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { slug } = req.body;
    if (!slug) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 400,
            message: 'Slug is required',
            data: null,
        });
        return;
    }
    const result = yield externalApi_service_1.externalApiService.getSingleExternalApiData(slug, user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: 'Data fetched successfully',
        data: result,
    });
}));
const deletePreviousEpisode = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { slug } = req.body;
    if (!slug) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 400,
            message: 'Slug is required',
            data: null,
        });
        return;
    }
    const result = yield externalApi_service_1.externalApiService.deletePreviousEpisode(slug, user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: 'Data deleted successfully',
        data: result,
    });
}));
exports.externalApiController = {
    saveExternalApi,
    getUserExternalApiData,
    getSingleExternalApiData,
    deletePreviousEpisode,
};
