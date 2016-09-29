/**
 * Class representing a Command
* */
export default class Command {
  /**
   * @param {string} extensionName The name of the extension registering commands
   * @param {string} extensionPath Absolute path to the extension
   * @param {Object} command Instance of Commandjs
   */
  constructor(extensionName, extensionPath, commander) {
    this._commander = commander;
    this._extensionName = extensionName;
    this._extensionPath = extensionPath;
  }

  /**
   * Set pattern for the command
   *
   * @param {string} command Pattern to register with Commanderjs
   * @return {undefined}
   */
  setCommand(command) {
    /**
     * @type {string} Command pattern
     */
    this.command = command;
  }

  /**
   * Get pattern for the command
   *
   * @return {string} Command pattern
   */
  getCommand() {
    return this.command;
  }

  /**
   * Set command description
   *
   * @param {string} description Description of what this command does
   * @return {undefined}
   */
  setDescription(description) {
    /**
     * @type {string} Command description
     */
    this.description = description;
  }

  /**
   * Get command description
   *
   * @return {string} Command description
   */
  getDescription() {
    return this.description;
  }

  /**
   * Set command action
   *
   * @param {function} action What should happen when the command is called
   * @return {undefined}
   */
  setAction(action) {
    /**
     * @type {function} Function to call when the command is called
     */
    this.action = action;
  }

  /**
   * Register commands with Commandjs
   */
  registerCommand() {
    this._commander
      .command(this.command)
      .description(this.description)
      .action((args, options) => this.action(args, options));
  }
}
