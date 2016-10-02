import winston from 'winston';

/**
 * A multi-transport async logging library for node.js that is passed to Stanza
 * extensions to make logging easier for the developers
 *
 * @access public
 * @type {Object} Instantiated Winston Logger
 */
const logger = new winston.Logger;


/**
 * @todo
 *
 * Verbose levels for logging, pass flags for debug, verbose and set the param
 * on the loggers config
 *
 * check to make sure we are not setting default values
 */
logger.add(winston.transports.Console, {
  colorize: true,
  prettyPrint: true,
  silent: false,
  timestamp: true,
});

export default logger;
