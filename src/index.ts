import express from 'express';
import cookieParser from 'cookie-parser';
import DatabaseConnection from './config/DatabaseConnection';
import router from './route';
import { errorHandler } from './middleware';
import logger from './config/logger';

require('dotenv').config();

const app = express();

DatabaseConnection.setup().then(() => {
  app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log('app are running on port : 3000');
  });

  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use('/', router(logger));
  app.use(errorHandler);
}).catch((e) => {
  logger.log({ level: 'error', message: e.toString() });
  process.exit();
});

process.on('uncaughtException', (error) => {
  logger.log({ level: 'error', message: error.toString() });
  process.exit(1000);
});
