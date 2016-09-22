import glob from 'glob';
import resolve from 'resolve';

/**
 * Class representing an Extension
* */
export default class Extension {
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
  constructor(name, registerWithObject, keyword) {
    this._name = name;
    this._registerWithObject = registerWithObject;
    this._keyword = keyword;

    this._commands = [];
  }

  /**
   * Discover commands belonging to this extension and pass Commander to them;
   * Commands are responsible for registering themselfs with Commanderjs
   *
   * @name discoverCommands
   * @function
   * @param {string} path The extensions absolute path
   */
  discoverCommands(path) {
    const commands = glob.sync('*.js', { cwd: path });

    this._commands = commands.map(commandFileName => {
      const commandPath = resolve.sync(`${path}/${commandFileName}`);
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
