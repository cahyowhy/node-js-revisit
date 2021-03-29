import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [new winston.transports.File({ filename: '../log/error.log', level: 'error' })],
});

logger.add(new winston.transports.Console({
  format: winston.format.colorize(),
}));

export default logger;
