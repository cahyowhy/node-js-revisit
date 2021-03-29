import winston from 'winston';
import userRoute from './user-route';
import bookRoute from './book-route';
import userBookRoute from './user-book-route';

export default (logger: winston.Logger) => [
  userRoute(logger),
  bookRoute(logger),
  userBookRoute(logger),
];
