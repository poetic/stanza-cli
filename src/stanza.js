import commander from 'commander';
import findUp from 'find-up';
import path from 'path';
import packageJson from '../package.json';
import pkgConf from 'pkg-conf';
import { registerExtensions } from './imports/extensions';
import yeoman from 'yeoman-environment';

class Stanza {
  constructor() {
    this.setAppRoot();

    this.extensionCommands = [];
    this.yeomanEnv = yeoman.createEnv();

    this.registerCommand = this.registerCommand.bind(this);
    this.registerGenerator = this.registerGenerator.bind(this);
  }

  registerCommand(command) {
    this.extensionCommands.push(command);
  }

  registerGenerator(generatorPath, namespace) {
    this.yeomanEnv.register(generatorPath, namespace);
  }

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
      console.log('generate generator');
    }

    commander
    .command(pattern)
    .description(description)
    .action((arg, options) => action(arg, options, additionalParams));
  });

  commander.parse(process.argv);
}
