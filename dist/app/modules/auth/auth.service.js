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
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists in the database
    if (!(yield user_model_1.User.isUserExist(payload.email))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // check if user is deleted
    if (yield user_model_1.User.isUserDeleted(payload.email)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is deleted');
    }
    // Check if the password is correct
    const user = yield user_model_1.User.isUserPasswordMatched(payload.email, payload.password);
    // create jwt token
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expiration);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expiration);
    return {
        accessToken,
        refreshToken,
        user,
    };
});
const registerUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists in the database
    if (yield user_model_1.User.isUserExist(payload.email)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User already exists');
    }
    if (payload.password !== payload.confirmPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Passwords do not match');
    }
    // create user
    const result = yield user_model_1.User.create({
        email: payload.email,
        name: payload.name,
        password: payload.password,
        role: 'normal',
    });
    const refreshToken = (0, auth_utils_1.createToken)({
        email: result.email,
        role: result.role,
    }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expiration);
    return {
        refreshToken,
        result,
    };
});
const changePasswordService = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists in the database
    if (!(yield user_model_1.User.isUserExist(userData.email))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // check if user is deleted
    if (yield user_model_1.User.isUserDeleted(userData.email)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is deleted');
    }
    // Check if the password is correct
    const user = yield user_model_1.User.isUserPasswordMatched(userData.email, payload.oldPassword);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Old password is incorrect');
    }
    // hash the new password
    const newPassword = yield bcrypt_1.default.hashSync(payload.newPassword, Number(config_1.default.bcrypt_salt));
    // update the user password
    yield user_model_1.User.findOneAndUpdate({
        email: userData.email,
        role: userData.role,
    }, {
        password: newPassword,
    }, {
        new: true,
    });
    return null;
});
const refreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // verify token
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    // Check if the user exists in the database
    if (!(yield user_model_1.User.isUserExist(email))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // check if user is deleted
    if (yield user_model_1.User.isUserDeleted(email)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is deleted');
    }
    // create jwt token
    const jwtPayload = {
        email: decoded.email,
        role: decoded.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expiration);
    return {
        accessToken,
    };
});
exports.authService = {
    loginUserService,
    changePasswordService,
    refreshTokenService,
    registerUserService,
};
