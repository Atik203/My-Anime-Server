import { z } from 'zod';

export const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'email is required',
      })
      .email({
        message: 'email must be a valid email',
      }),
    password: z
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

export const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({
        required_error: 'old password is required',
      })
      .min(4, {
        message: 'password must be at least 4 characters long',
      })
      .max(50, {
        message: 'password must be at most 50 characters long',
      }),
    newPassword: z
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

export const registerValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'email is required',
      })
      .email({
        message: 'email must be a valid email',
      }),
    password: z
      .string({
        required_error: 'password is required',
      })
      .min(4, {
        message: 'password must be at least 4 characters long',
      })
      .max(30, {
        message: 'password must be at most 30 characters long',
      }),
    name: z
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

export const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'refreshToken is required',
    }),
  }),
});
