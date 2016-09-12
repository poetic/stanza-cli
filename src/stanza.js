import commander from 'commander';
import packageJson from '../package.json';
import registerExtensions from './imports/register-extensions';
import logger from './imports/logger';

/**
 * Stanza class.
 */
export default class Stanza {
  /**
   * Initializes commander and registers extensions.
   */
  constructor() {
    this.logger = logger;

    commander
      .version(packageJson.version)
      .description(packageJson.description);

    registerExtensions('stanza-extension', this, { includeGlobal: true });
  }

  /**
   * Runs the command line interface.
   */
  cli() {
    commander.parse(process.argv);
  }
}

