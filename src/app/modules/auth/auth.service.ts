import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../Errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser, TRegisterUser } from './auth.interface';
import { createToken } from './auth.utils';

const loginUserService = async (payload: TLoginUser) => {
  // Check if the user exists in the database
  if (!(await User.isUserExist(payload.email))) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // check if user is deleted

  if (await User.isUserDeleted(payload.email)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is deleted');
  }

  // Check if the password is correct

  const user = await User.isUserPasswordMatched(
    payload.email,
    payload.password,
  );

  // create jwt token

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiration as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expiration as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const registerUserService = async (payload: TRegisterUser) => {
  // Check if the user exists in the database
  if (await User.isUserExist(payload.email)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
  }
  if (payload.password !== payload.confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Passwords do not match');
  }

  // create user

  const result = await User.create({
    email: payload.email,
    name: payload.name,
    password: payload.password,
    role: 'normal',
  });

  const refreshToken = createToken(
    {
      email: result.email,
      role: result.role,
    },
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expiration as string,
  );

  return {
    refreshToken,
    result,
  };
};

const changePasswordService = async (
  userData: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
  },
) => {
  // Check if the user exists in the database
  if (!(await User.isUserExist(userData.email))) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // check if user is deleted

  if (await User.isUserDeleted(userData.email)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is deleted');
  }

  // Check if the password is correct

  const user = await User.isUserPasswordMatched(
    userData.email,
    payload.oldPassword,
  );

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Old password is incorrect');
  }

  // hash the new password
  const newPassword = await bcrypt.hashSync(
    payload.newPassword,
    Number(config.bcrypt_salt),
  );

  // update the user password

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newPassword,
    },
    {
      new: true,
    },
  );

  return null;
};

const refreshTokenService = async (token: string) => {
  // verify token
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { email } = decoded;

  // Check if the user exists in the database
  if (!(await User.isUserExist(email))) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // check if user is deleted

  if (await User.isUserDeleted(email)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is deleted');
  }

  // create jwt token

  const jwtPayload = {
    email: decoded.email,
    role: decoded.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiration as string,
  );

  return {
    accessToken,
  };
};

export const authService = {
  loginUserService,
  changePasswordService,
  refreshTokenService,
  registerUserService,
};
