import winston from 'winston';

const logger = new winston.Logger;

logger.add(winston.transports.Console, {
  colorize: true,
  level: 'debug',
  prettyPrint: true,
  silent: false,
  timestamp: false,
});

export default logger;
