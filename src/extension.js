import glob from 'glob';
import resolve from 'resolve';

/**
 * Class representing an Extension
* */
class Extension {
  /**
   * When an extension is instantiated, pass in the object in which to register
   * with and the module keyword
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

    this._commands = [];

    this.discoverCommands();
  }

  /**
   * Find extension commands and instantiate the class, pass command to the
   * Class; Commands are responsible for registering with Stanza
   *
   * @name discoverCommands
   * @returns {undefined}
   */
  discoverCommands() {
    const commands = glob.sync('commands/*.js', { cwd: this._extensionPath });

    this._commands = commands.map(commandFileName => {
      const commandPath = resolve.sync(`${this._extensionPath}/${commandFileName}`);
      const Command = require(commandPath).default;
      const command = new Command(
        this._name,
        this._extensionPath,
        this._registerWithObject.commander
      );

      return command;
    });
  }
}

export default Extension;
