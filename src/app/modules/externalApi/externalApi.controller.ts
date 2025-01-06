import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { TExternalAPi } from '../myAnime/myAnimeLive.interface';
import { externalApiService } from './externalApi.service';

const saveExternalApi = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;

  const result = await externalApiService.saveExternalApiData(
    data as unknown as TExternalAPi,
    user,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Data saved successfully',
    data: result,
  });
});

const getUserExternalApiData = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await externalApiService.getUserExternalApiData(user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Data fetched successfully',
    data: result,
  });
});

const getSingleExternalApiData = catchAsync(async (req, res) => {
  const user = req.user;
  const { slug } = req.body;
  if (!slug) {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Slug is required',
      data: null,
    });
    return;
  }

  const result = await externalApiService.getSingleExternalApiData(slug, user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Data fetched successfully',
    data: result,
  });
});

const deletePreviousEpisode = catchAsync(async (req, res) => {
  const user = req.user;
  const { slug } = req.body;
  if (!slug) {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Slug is required',
      data: null,
    });
    return;
  }

  const result = await externalApiService.deletePreviousEpisode(slug, user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Data deleted successfully',
    data: result,
  });
});

export const externalApiController = {
  saveExternalApi,
  getUserExternalApiData,
  getSingleExternalApiData,
  deletePreviousEpisode,
};
