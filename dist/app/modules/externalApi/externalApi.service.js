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
exports.externalApiService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const user_model_1 = require("../user/user.model");
const externalApi_model_1 = require("./externalApi.model");
const saveExternalApiData = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield user_model_1.User.isUserExist(user.email))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const getUser = yield user_model_1.User.findOne({ email: user.email });
    // check if there save data already using slug
    const isDataExist = yield externalApi_model_1.ExternalApi.findOne({
        slug: data.slug,
        user: getUser === null || getUser === void 0 ? void 0 : getUser._id,
    });
    if (isDataExist) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Data already exist');
    }
    const result = yield externalApi_model_1.ExternalApi.create(Object.assign(Object.assign({}, data), { user: getUser === null || getUser === void 0 ? void 0 : getUser._id }));
    // Populate the user field
    const populatedResult = yield result.populate('user');
    return populatedResult;
});
const getUserExternalApiData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield user_model_1.User.isUserExist(user.email))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const getUser = yield user_model_1.User.findOne({ email: user.email });
    const result = yield externalApi_model_1.ExternalApi.find({ user: getUser === null || getUser === void 0 ? void 0 : getUser._id });
    return result;
});
const getSingleExternalApiData = (slug, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield user_model_1.User.isUserExist(user.email))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const getUser = yield user_model_1.User.findOne({ email: user.email });
    const result = yield externalApi_model_1.ExternalApi.findOne({ slug, user: getUser === null || getUser === void 0 ? void 0 : getUser._id });
    return result;
});
const deletePreviousEpisode = (slug, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield user_model_1.User.isUserExist(user.email))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const getUser = yield user_model_1.User.findOne({ email: user.email });
    const result = yield externalApi_model_1.ExternalApi.findOneAndDelete({
        slug,
        user: getUser === null || getUser === void 0 ? void 0 : getUser._id,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Data not found');
    }
    return result;
});
exports.externalApiService = {
    saveExternalApiData,
    getUserExternalApiData,
    getSingleExternalApiData,
    deletePreviousEpisode,
};
