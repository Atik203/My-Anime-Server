import express from 'express';
import { auth } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { myAnimeLiveController } from '../myAnime/myAnimeLive.controller';
import { externalApiController } from './externalApi.controller';
import { saveExternalApiDataSchema } from './externalApi.validation.zod';

const router = express.Router();

router.post('/', myAnimeLiveController);

router.post(
  '/save',
  auth('admin', 'normal', 'superAdmin'),
  validateRequest(saveExternalApiDataSchema),
  externalApiController.saveExternalApi,
);

router.get(
  '/my-data',
  auth('admin', 'normal', 'superAdmin'),
  externalApiController.getUserExternalApiData,
);

router.post(
  '/my-data/single',
  auth('admin', 'normal', 'superAdmin'),
  externalApiController.getSingleExternalApiData,
);

router.post(
  '/delete-previous-ep',
  auth('admin', 'normal', 'superAdmin'),
  externalApiController.deletePreviousEpisode,
);

export const externalApiRoutes = router;
