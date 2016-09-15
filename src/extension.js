import glob from 'glob';
import path from 'path';
import resolve from 'resolve';
import yeoman from 'yeoman-environment';

/**
 * Class representing an Extension
* */
class Extension {
  /**
   * When an extension is instantiated, pass in the object in which to register
   * with and the module keyword; Run discoverChildren to register commands and
   * generators with Stanza.
   *
   * @param {string} name Extension Name
   * @param {Object} registerWithObject Object in which to register commands and
   * generators with. i.e Stanza
   * @param {string} keyword If registering another extension, what type?
   * @param {string} extensionPath Absolute path of class extending Extension
   * @returns {undefined}
   */
  constructor(name, registerWithObject, keyword, extensionPath) {
    this._name = name;
    this._extensionPath = extensionPath;
    this._registerWithObject = registerWithObject;
    this._keyword = keyword;
    this._yeomanEnv = yeoman.createEnv();

    this._commands = [];
    this._generators = [];

    this.discoverCommands();
    this.discoverGenerators();
  }

  /**
   * Find extenstion commands and register them with Stanza
   *
   * @name discoverCommands
   * @returns {undefined}
   */
  discoverCommands() {
    const commands = glob.sync('commands/**.js', { cwd: this._extensionPath });

    commands.forEach(commandFileName => {
      const commandPath = resolve.sync(`${this._extensionPath}/${commandFileName}`);
      const command = require(commandPath);

      this._commands.push(command);

      const additionalParams = {
        name: this._name,
      };

      if (command.pattern.includes('generate')) {
        additionalParams.yeomanEnv = this._yeomanEnv;
      }

      this._registerWithObject.commander
        .command(command.pattern)
        .description(command.description)
        .action((arg, options) => command.action(arg, options, additionalParams));
    });
  }

 /**
   * Find extenstion generators and register them with Stanza
   *
   * @name discoverGenerators
   * @returns {undefined}
   */
  discoverGenerators() {
    const generators = glob.sync('generators/*/index.js', { cwd: this._extensionPath });

    generators.forEach(generator => {
      const generatorPath = resolve.sync(`${this._extensionPath}/${generator}`);
      const directory = path.dirname(generatorPath).split('/').pop();
      const namespace = `${this._name}:${directory}`;

      this._generators.push({ generatorPath, namespace });

      this._yeomanEnv.register(generatorPath, namespace);
    });
  }
}

export default Extension;
