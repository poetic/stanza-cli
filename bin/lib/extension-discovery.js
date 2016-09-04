const _ = require('lodash');
const appRootDir = require('app-root-dir').get();
const findUp = require('find-up');
const fs = require('fs');
const junk = require('junk');
const path = require('path');
const resolve = require('resolve');

const packageJsonPath = findUp.sync('package.json', { cwd: appRootDir });
const packageJson = require(packageJsonPath);

/**
 * Discovery generator and command extensions through core extensions and package.json
 *
 * @name extensionDiscovery
 * @function
 * @param {Object} path Stanza with register functions
 */
module.exports = stanza => {
  const npmExtensions = packageJson.devDependencies;

  for (const dependency in npmExtensions) {
    let dependencyPath = '';

    try {
      dependencyPath = resolve.sync(dependency, { basedir: appRootDir });
    } catch (error) {
      // console.log('');
      // console.log(`Error trying to resolve dependency ${dependency}. Continuing...`);
      // console.log('');

      // console.log('Error trying to resolve dependency path (error): ', error);

      continue;
    }

    const dependencyPackageJsonPath = findUp.sync('package.json', { cwd: dependencyPath });
    const dependencyPackageJson = require(dependencyPackageJsonPath);
    const keywords = dependencyPackageJson.keywords || [];

    if (_.includes(keywords, 'stanza-extension')) {
      console.log('stanza-extensions found: ', dependency);

      const extensionPath = path.dirname(dependencyPackageJsonPath);
      const extension = require(extensionPath);

      extension.register(stanza, dependencyPath);
    }
  }

  /*
   *
   * Load Stanza Core Extensions
   *
   * */

  const stanzaCoreExtensionsPath = findUp.sync('extensions', { cwd: __dirname });
  const coreExtensions = fs.readdirSync(stanzaCoreExtensionsPath);

  _.each(coreExtensions.filter(junk.not), coreExtension => {
    let extensionPath = '';

    try {
      extensionPath = resolve.sync(
        coreExtension,
        {
          extensions: ['.js'],
          moduleDirectory: 'extensions',
        }
      );
    } catch (error) {
      console.log('');
      console.log(`Error trying to resolve dependency ${coreExtension}. Continuing...`);
      console.log('');
    }

    const extension = require(extensionPath);
    extension.register(stanza);
  });
};
