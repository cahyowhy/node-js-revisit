import winston from 'winston';
import { Router } from 'express';
import { Ajv } from 'ajv';
import UserBookController from '../controller/UserBookController';
import { authenticateAccessToken, queryParseFilter } from '../middleware';

const router = Router();

export default (logger: winston.Logger, ajv: Ajv) => {
  const userBookController = new UserBookController(logger, ajv);

  router.get('/api/return-books/book/:bookId/user/:userId', authenticateAccessToken, userBookController.returnBook);
  router.post('/api/borrow-books/:userId', authenticateAccessToken, userBookController.borrowBook);
  router.post('/api/user-books', authenticateAccessToken, userBookController.create);
  router.put('/api/user-books/:id', authenticateAccessToken, userBookController.update);
  router.delete('/api/user-books/:id', authenticateAccessToken, userBookController.delete);
  router.get('/api/user-books', queryParseFilter, authenticateAccessToken, userBookController.find);

  return router;
};
