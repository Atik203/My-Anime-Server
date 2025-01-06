import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { fetchAnimeDetails } from './myAnimeLive.service';

export const myAnimeLiveController = catchAsync(async (req, res) => {
  const { url } = req.query;

  if (!url) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'URL is required',
      data: null,
    });
    return;
  }

  const animeDetails = await fetchAnimeDetails(url as string);
  if (!animeDetails) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error fetching anime details',
      data: null,
    });
    return;
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Anime details fetched successfully',
    data: animeDetails,
  });
});
