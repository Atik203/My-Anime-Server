import express from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { externalApiRoutes } from '../modules/externalApi/externalApi.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/myanime',
    route: externalApiRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
