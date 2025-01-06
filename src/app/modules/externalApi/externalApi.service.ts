import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../Errors/AppError';
import { TExternalAPi } from '../myAnime/myAnimeLive.interface';
import { User } from '../user/user.model';
import { ExternalApi } from './externalApi.model';

const saveExternalApiData = async (data: TExternalAPi, user: JwtPayload) => {
  if (!(await User.isUserExist(user.email))) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const getUser = await User.findOne({ email: user.email });

  // check if there save data already using slug

  const isDataExist = await ExternalApi.findOne({
    slug: data.slug,
    user: getUser?._id,
  });

  if (isDataExist) {
    throw new AppError(httpStatus.CONFLICT, 'Data already exist');
  }

  const result = await ExternalApi.create({
    ...data,
    user: getUser?._id,
  });

  // Populate the user field
  const populatedResult = await result.populate('user');

  return populatedResult;
};

const getUserExternalApiData = async (user: JwtPayload) => {
  if (!(await User.isUserExist(user.email))) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const getUser = await User.findOne({ email: user.email });

  const result = await ExternalApi.find({ user: getUser?._id });

  return result;
};

const getSingleExternalApiData = async (slug: string, user: JwtPayload) => {
  if (!(await User.isUserExist(user.email))) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const getUser = await User.findOne({ email: user.email });

  const result = await ExternalApi.findOne({ slug, user: getUser?._id });

  return result;
};

export const externalApiService = {
  saveExternalApiData,
  getUserExternalApiData,
  getSingleExternalApiData,
};
