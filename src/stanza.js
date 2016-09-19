import commander from 'commander';
import logger from './imports/logger';
import packageJson from '../package.json';
import path from 'path';
import pkgConf from 'pkg-conf';
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

    /**
     * @type {Object} Winston logger
     */
    this.logger = logger;

    /**
     * @type {Object} Commanderjs
     */
    this.commander = commander;

    /**
     * @type {Extension[]} Registered Extensions
     */
    this.extensions = registerExtensions(
      'stanza-extension',
      this,
      {
        includeGlobal: true,
      }
    );
  }

  /**
   * Runs the command line interface.
   */
  cli() {
    commander.parse(process.argv);
  }

  /**
   * Get the root path where Stanza is running
   *
   * @name projectRoot
   * @function
   * @returns {string} String representing root path of where Stanza is running
   */
  get projectRoot() {
    if (typeof this._projectRoot !== 'undefined') {
      return this._projectRoot;
    }

    const packageConfig = pkgConf.sync('keywords');
    const isStanzaProject = Object.keys(packageConfig)
      .map(key => packageConfig[key])
      .includes('stanza-project');

    this._projectRoot = isStanzaProject
      ? path.dirname(pkgConf.filepath(packageConfig))
      : false;

    return this._projectRoot;
  }
}

