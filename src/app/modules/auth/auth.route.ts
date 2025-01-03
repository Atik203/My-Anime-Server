import express from 'express';
import { auth } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { authController } from './auth.controller';
import {
  changePasswordValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  registerValidationSchema,
} from './auth.zod.validation';

const router = express.Router();

router.post(
  '/login',
  validateRequest(loginValidationSchema),
  authController.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.normal, USER_ROLE.superAdmin),
  validateRequest(changePasswordValidationSchema),
  authController.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(refreshTokenValidationSchema),
  authController.refreshToken,
);

router.post(
  '/register',
  validateRequest(registerValidationSchema),
  authController.registerUser,
);

export const authRoutes = router;
