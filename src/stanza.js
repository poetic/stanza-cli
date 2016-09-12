import commander from 'commander';
import packageJson from '../package.json';
import registerExtensions from './imports/register-extensions';

/**
 * Stanza class.
 */
export default class Stanza {
  /**
   * Initializes commander and registers extensions.
   */
  constructor() {
    commander
      .version(packageJson.version)
      .description(packageJson.description);

    registerExtensions('stanza-extension', this, true);
  }

  /**
   * Runs the command line interface.
   */
  cli() {
    commander.parse(process.argv);
  }
}

