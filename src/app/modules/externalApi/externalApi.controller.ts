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

export const externalApiController = {
  saveExternalApi,
  getUserExternalApiData,
};
