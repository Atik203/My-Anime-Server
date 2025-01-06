import express from 'express';
import { externalApiController } from './myAnimeLive.controller';

const router = express.Router();

router.get(
  '/',

  externalApiController.myAnimeLiveController,
);

export const externalApiRoutes = router;
