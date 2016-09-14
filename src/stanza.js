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
    this.commander = commander;

    commander
      .version(packageJson.version)
      .description(packageJson.description);

    this.registeredExtension = registerExtensions(
      'stanza-extension',
      this,
      { includeGlobal: true }
    );
  }

  /**
   * Runs the command line interface.
   */
  cli() {
    commander.parse(process.argv);
  }

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

