import commander from 'commander';
import packageJson from '../package.json';
import path from 'path';
import pkgConf from 'pkg-conf';
import yeoman from 'yeoman-environment';
import { registerExtensions } from './imports/extensions';

/**
 * Class representing Stanza
* */
class Stanza {
  /**
   * When Stanza is instantiated, set the global app root, create the Yeoman envorinment,
   * and bind this to register functions.
   *
   * @memberof Stanza
   * @name constructor
   */
  constructor() {
    this.setAppRoot();

    this.extensionCommands = [];
    this.yeomanEnv = yeoman.createEnv();

    this.registerCommand = this.registerCommand.bind(this);
    this.registerGenerator = this.registerGenerator.bind(this);
  }

  /**
   * Register commands with Commander
   *
   * @memberof Stanza
   * @name registerCommand
   * @param {Object} command The pattern, description and action function of the command
   */
  registerCommand(command) {
    this.extensionCommands.push(command);
  }

  /**
   * Register Yeoman generators with Stanza
   *
   * @memberof Stanza
   * @name registerGenerator
   * @param {string} generatorPath Path to Yeoman generator
   * @param {string} namespace Register the generator under this namespace
   */
  registerGenerator(generatorPath, namespace) {
    this.yeomanEnv.register(generatorPath, namespace);
  }

  /**
   * Determine where Stanza is running and set the APP_ROOT_PATH appropriatly
   *
   * @memberof Stanza
   * @name setAppRoot
   */
  setAppRoot() {
    let appRootPath = '';

    const packageConfig = pkgConf.sync('keywords');
    const isStanzaProject = Object.keys(packageConfig)
      .map(key => packageConfig[key])
      .includes('stanza-project');

    const packageJsonPath = isStanzaProject
      ? pkgConf.filepath(packageConfig)
      : false;

    if (!packageJsonPath) {
      appRootPath = process.cwd(); // set this to global
    } else {
      appRootPath = path.dirname(packageJsonPath);
    }

    global.APP_ROOT_PATH = appRootPath;

    this.appRootPath = appRootPath;
  }
}

/**
 * Stanza entry point. Aggregates all extensions and runs commander.
 *
 * @function stanza
 * @returns {undefined}
 */
export default function initStanza() {
  const stanza = new Stanza();

  registerExtensions('stanza-extension', stanza, 'register', true);

  commander
    .version(packageJson.version)
    .description(packageJson.description);

  stanza.extensionCommands.forEach(command => {
    const { action, description, pattern } = command;
    const additionalParams = {};

    if (pattern.includes('generate')) {
      additionalParams.yeomanEnv = stanza.yeomanEnv;
    }

    commander
    .command(pattern)
    .description(description)
    .action((arg, options) => action(arg, options, additionalParams));
  });

  commander.parse(process.argv);
}
