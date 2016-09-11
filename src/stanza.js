import commander from 'commander';
import pkgConf from 'pkg-conf';

import packageJson from '../package.json';
import registerExtensions from './imports/register-extensions';

/**
 * Class representing Stanza
 */
export default class Stanza {
  /**
   *
   *
   * @returns {undefined}
   */
  constructor() {
    commander
      .version(packageJson.version)
      .description(packageJson.description);

    registerExtensions('stanza-extension', this, 'register', true);
  }

  /**
   * Runs the command line interface.
   *
   * @returns {undefined}
   */
  cli() {
    commander.parse(process.argv);
  }

  /**
   * Determines the project's root path by finding the nearest package.json and
   * checking it for the "stanza-project" keyword.
   *
   * @returns {string|false} project's root path or false if not in a project.
   */
  get projectRoot() {
    // memoize
    if(typeof this._projectRoot !== 'undefined') {
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
