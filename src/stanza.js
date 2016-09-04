import _ from 'lodash';
import commander from 'commander';
import yeoman from 'yeoman-environment';
import coreCommands from './core-commands';

const env = yeoman.createEnv();
const commandExtensions = [];

/**
 * Stanza Run
 *
 * @name run
 * @function
 */
module.exports.run = () => {
  const commands = [
    ...coreCommands,
    ...commandExtensions,
  ];

  commander
  .description('Stanza Extentendable CLI Tool');

  _.each(commands, command => {
    const { action, description, pattern } = command;
    const additionalParams = {};

    if (pattern.includes('generate')) {
      additionalParams.env = env;
    }

    commander
    .command(pattern)
    .description(description)
    .action((arg, options) => action(arg, options, additionalParams));
  });

  commander.parse(process.argv);
};

/**
 * Register Yeoman Generator with Stanza
 *
 * @name registerGenerator
 * @function
 * @param {String} path Absolute path to Yeoman Generator
 */
module.exports.registerGenerator = path => {
  env.register(path);
};


/**
 * Register Commands with Stanza
 *
 * @name registerCommand
 * @function
 * @param {Object} commandOptions Pattern, description and action of command
 */
module.exports.registerCommand = commandOptions => {
  commandExtensions.push(commandOptions);
};
