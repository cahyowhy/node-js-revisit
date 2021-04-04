import express from 'express';
import cookieParser from 'cookie-parser';
import DatabaseConnection from './config/DatabaseConnection';
import router from './route';
import { errorHandler } from './middleware';
import logger from './config/logger';
import ajv from './config/ajv';

require('dotenv').config();

const healthCheck = require('healthchecks-api');
const path = require('path');

const app = express();

DatabaseConnection.setup().then(async () => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));

  // custom adapter so won't errror on windows
  const adapter = async (service: any, server: any, route: any) => {
    const url: string = path.join('/status', route.path).replace(/\\/g, '/');

    // 1. Expose given route in the `http` server application, here an example for the `Express.js`:
    // eslint-disable-next-line implicit-arrow-linebreak
    return server.get(url, async (req: any, res: any, next: any) => {
      try {
        // 2. Combine the `Express.js` route parameters:
        const params = { ...req.params, ...req.query, ...req.headers };
        // 3. Call given `route.handler` passing combined parameters and given service descriptor:
        const result = await route.handler(params, service);
        // 4. Decorate the `Express.js` response:
        res.status(result.status);
        res.set('Content-Type', result.contentType);
        res.set(result.headers);
        // 5. Return the response body according to given `contentType`:
        switch (result.contentType) {
          case 'application/json':
            res.json(result.body);
            break;
          default:
            res.send(result.body);
        }
      } catch (err) {
        // 6. Deal with the Error according to `Express.js` framework rules.
        next(err);
      }
    });
  };

  // see https://hootsuite.github.io/health-checks-api/
  await healthCheck(app, {
    adapter,
    service: {
      config: {
        name: 'node-js-revisit',
        description: 'Demo app for studying about typescript',
        checks: [
          // this need python
          /* {
            check: 'self',
            memwatch: 'memwatch-next',
          }, */
          {
            name: 'mongo',
            url: process.env.DB_URL,
            type: 'external',
            interval: 3000,
            check: 'mongo',
          },
        ],
      },
    },
  });

  app.use('/', router(logger, ajv));
  app.use(errorHandler);

  app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log('app are running on port : 3000');
  });
}).catch((e) => {
  logger.log({ level: 'error', message: e.toString() });
  process.exit();
});

process.on('uncaughtException', (error) => {
  logger.log({ level: 'error', message: error.toString() });
  process.exit(1000);
});
