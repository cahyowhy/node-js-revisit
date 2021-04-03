import winston from 'winston';
import { Router } from 'express';
import { Ajv } from 'ajv';
import BookController from '../controller/BookController';
import { authenticateAccessToken, queryParseFilter } from '../middleware';

const router = Router();

export default (logger: winston.Logger, ajv: Ajv) => {
  const bookController = new BookController(logger, ajv);

  router.post('/api/books', authenticateAccessToken, bookController.create);
  router.put('/api/books/:id', authenticateAccessToken, bookController.update);
  router.delete('/api/books/:id', authenticateAccessToken, bookController.delete);
  router.get('/api/books', queryParseFilter, authenticateAccessToken, bookController.find);

  return router;
};
