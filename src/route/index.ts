import winston from 'winston';
import { Ajv } from 'ajv';
import userRoute from './user-route';
import bookRoute from './book-route';
import userBookRoute from './user-book-route';

export default (logger: winston.Logger, ajv: Ajv) => [
  userRoute(logger, ajv),
  bookRoute(logger, ajv),
  userBookRoute(logger, ajv),
];
