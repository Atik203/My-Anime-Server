import express from 'express';
import { auth } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { myAnimeLiveController } from '../myAnime/myAnimeLive.controller';
import { externalApiController } from './externalApi.controller';
import { saveExternalApiDataSchema } from './externalApi.validation.zod';

const router = express.Router();

router.get('/', myAnimeLiveController);

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

export const externalApiRoutes = router;
