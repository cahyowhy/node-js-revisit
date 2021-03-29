import winston from 'winston';
import { Router } from 'express';
import UserBookController from '../controller/UserBookController';
import { authenticateAccessToken, queryParseFilter } from '../middleware';

const router = Router();

export default (logger: winston.Logger) => {
  const userBookController = new UserBookController(logger);

  router.post('/api/user-books', authenticateAccessToken, userBookController.create);
  router.put('/api/user-books/:id', authenticateAccessToken, userBookController.update);
  router.delete('/api/user-books/:id', authenticateAccessToken, userBookController.delete);
  router.get('/api/user-books', queryParseFilter, authenticateAccessToken, userBookController.find);

  return router;
};
