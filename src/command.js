export default class Command {
  constructor(extensionName, extensionPath, commander) {
    this._commander = commander;
    this._extensionName = extensionName;
    this._extensionPath = extensionPath;
  }

  setCommand(command) {
    this.command = command;
  }

  getCommand() {
    return this.command;
  }

  setDescription(description) {
    this.description = description;
  }

  getDescription() {
    return this.description;
  }

  setAction(action) {
    this.action = action;
  }

  registerCommand() {
    this._commander
      .command(this.command)
      .description(this.description)
      .action((args, options) => this.action(args, options));
  }
}
