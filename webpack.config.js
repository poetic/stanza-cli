/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/stanza.js',
  output: {
    path: './bin',
    filename: 'stanza.bundle.js',
    libraryTarget: 'commonjs2',
    library: 'stanza',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint',
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.json$/,
        loader: 'json',
        exclude: /node_modules/,
      },
    ],
  },
};
