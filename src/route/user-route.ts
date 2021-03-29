import winston from 'winston';
import { Router } from 'express';
import UserController from '../controller/UserController';
import { authenticateAccessToken, queryParseFilter } from '../middleware';

const router = Router();

export default (logger: winston.Logger) => {
  const userController = new UserController(logger);

  router.post('/api/users', userController.create);
  router.put('/api/users/:id', authenticateAccessToken, userController.update);
  router.delete('/api/users/:id', authenticateAccessToken, userController.delete);
  router.get('/api/users', queryParseFilter, authenticateAccessToken, userController.find);
  router.post('/api/users/login', userController.authUser);
  router.get('/api/users/logout', authenticateAccessToken, userController.removeAuthUser);
  router.get('/api/users/session', userController.sessionUser);

  return router;
};
