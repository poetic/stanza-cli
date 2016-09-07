import findUp from 'find-up';
import path from 'path';
import pkgConf from 'pkg-conf';
import resolve from 'resolve';

/**
 * @module extensions
 */

/**
 * Searches for extensions that contain the passed keyword. Passes an object
 * into the register function of the resultant extensions allowing those
 * extensions to register themselves against the passed object.
 *
 * @param {string} keyword - Keyword to use when searching for extensions to
 * register.
 * @param {Object} object - Object to pass to the register function.
 * @param {string} [registerFunction=register] - Name of the register function
 * used during extension registration.
 * @param {boolean} [registerGlobal=false] - Determines if global packages
 * should be registered.
 * @returns {undefined}
 */
module.exports.registerExtensions = (
  keyword, object, registerFunction = 'register', registerGlobal = false
) => {
  const devDependencies = pkgConf.sync('devDependencies');

  // TODO: Add global package search
  Object.keys(devDependencies).forEach(dependency => {
    let dependencyPath = '';

    try {
      dependencyPath = resolve.sync(dependency, { basedir: global.APP_ROOT_PATH });
    } catch (error) {
      console.log(`Error trying to resolve dependency ${dependency}. Continuing...`);
    }

    const dependencyPackageJsonPath = findUp.sync('package.json', { cwd: dependencyPath });
    const dependencyPackageJson = require(dependencyPackageJsonPath);
    const keywords = dependencyPackageJson.keywords || [];

    if (keywords.includes(keyword)) {
      const extensionPath = path.dirname(dependencyPackageJsonPath);
      const extension = require(extensionPath);

      extension[registerFunction](object, dependencyPath);
    }
  });
};
