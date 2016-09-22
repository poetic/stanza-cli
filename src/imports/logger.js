import winston from 'winston';

/**
 * @type {Object} Instantiated Winston Logger
 */
const logger = new winston.Logger;


// TODO: verbose levels for logging
// default (error, warn)
// pass flags for:
// debug
// verbose
// set the param on the logging config to either debug or verbose
// check defaults to make sure we arn't setting the same values
logger.add(winston.transports.Console, {
  colorize: true,
  prettyPrint: true,
  silent: false,
  timestamp: true,
});

export default logger;
