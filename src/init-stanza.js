import commander from 'commander';
import packageJson from '../package.json';
import { registerExtensions } from './imports/extensions';
import Stanza from './stanza';

/**
 * Stanza entry point. Aggregates all extensions and runs commander.
 *
 * @function initStanza
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
