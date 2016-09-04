/**
 * Stanza Core Commands
 * @type {Array}
 *
 * @type {Object}
 * @property {String}  pattern
 * @property {String}  description
 * @property {Function}  action
 */
module.exports = [
  {
    pattern: 'extension-generator:generate [name]',
    description: 'Generate Stanza Extension',
    action: (arg, options, { env }) => {
      env.run('stanza-extension:app', { extensionName: arg });
    },
  },
  {
    pattern: 'extension-generator:generate:command [name]',
    description: 'Generate Stanza Extension Command',
    action: (arg, options, { env }) => {
      console.log('env.help(): ', env.help());

      env.run('stanza-extension:command', { commandName: arg });
    },
  },
  {
    pattern: 'extension-generator:generate:generator [name]',
    description: 'Generate Stanza Extension Generator',
    action: (arg, options, { env }) => {
      console.log('arg: ', arg);
      console.log('options: ', options);
      console.log('env: ', env);
    },
  },
];
