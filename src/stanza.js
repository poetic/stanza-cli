import path from 'path';
import pkgConf from 'pkg-conf';
import yeoman from 'yeoman-environment';

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

export default Stanza;

