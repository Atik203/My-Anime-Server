"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenValidationSchema = exports.registerValidationSchema = exports.changePasswordValidationSchema = exports.loginValidationSchema = void 0;
const zod_1 = require("zod");
exports.loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'email is required',
        })
            .email({
            message: 'email must be a valid email',
        }),
        password: zod_1.z
            .string({
            required_error: 'password is required',
        })
            .min(4, {
            message: 'password must be at least 4 characters long',
        })
            .max(30, {
            message: 'password must be at most 30 characters long',
        }),
    }),
});
exports.changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z
            .string({
            required_error: 'old password is required',
        })
            .min(4, {
            message: 'password must be at least 4 characters long',
        })
            .max(50, {
            message: 'password must be at most 50 characters long',
        }),
        newPassword: zod_1.z
            .string({
            required_error: 'new password is required',
        })
            .min(4, {
            message: 'password must be at least 4 characters long',
        })
            .max(50, {
            message: 'password must be at most 50 characters long',
        }),
    }),
});
exports.registerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'email is required',
        })
            .email({
            message: 'email must be a valid email',
        }),
        password: zod_1.z
            .string({
            required_error: 'password is required',
        })
            .min(4, {
            message: 'password must be at least 4 characters long',
        })
            .max(30, {
            message: 'password must be at most 30 characters long',
        }),
        name: zod_1.z
            .string({
            required_error: 'name is required',
        })
            .min(3, {
            message: 'name must be at least 3 characters long',
        })
            .max(50, {
            message: 'name must be at most 50 characters long',
        }),
    }),
});
exports.refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'refreshToken is required',
        }),
    }),
});
