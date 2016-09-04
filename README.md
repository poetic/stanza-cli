# Stanza
Stanza is a highly extensible cli that accelerates development workflows.
([Documentaion](https://poetic.github.io/stanza-cli/) |
[GitHub](https://github.com/poetic/stanza-cli))

## Features
* Command-line interface powered by
  [commander.js](https://github.com/tj/commander.js/)
* Code generation/scaffolding powered by
  [Yeoman](https://github.com/yeoman/yeoman)
* Powerful extension system that comprises commands, generators, build tools,
  servers, testing, linting, etc...
* Stanza extension generator to help you quickly extend stanza ([yo
  dawg](http://i.imgur.com/2gqiift.jpg))

View the [roadmap](ROADMAP.md) to see a list of current and planned features.

## Requirements
* node >= 6.0.0

## Installation
```
npm install -g poetic/sanza-cli
```

## Usage
After installation the `stanza` command will be available to you.

You can call `stanza [command] --help` to find out more about all of the
following commands.

### generate
```
stanza generate:extension [extension-name]
```

This will create a new folder `extension-name`, initialize a git repo in it, add
an extension project structure and install any necessary npm dependencies.
