import findUp from 'find-up';
import glob from 'glob';
import globalModules from 'global-modules';
import path from 'path';
import pkgConf from 'pkg-conf';
import resolve from 'resolve';
import logger from './logger';

/**
 * @module extensions
 */

/**
 * Searches project dependencies for modules that contain the passed keyword
 * with an optional parameter to search globally installed modules as well.
 * Passes an object into the register function of the resultant extensions
 * allowing those extensions to register themselves against the passed object.
 *
 * @param {string} keyword - Keyword to use when searching for extensions to
 * register.
 * @param {Object} object - Object to pass to the register function.
 * @param {string} [registerFunction=register] - Name of the register function
 * used during extension registration.
 * @param {boolean} [includeGlobal=false] - Determines if global packages
 * should be registered.
 * @returns {undefined}
 */
export default (keyword, object, registerFunction = 'register', includeGlobal =
  false) => {

  const dependencyNames = [
    ...Object.keys(pkgConf.sync('dependencies')),
    ...Object.keys(pkgConf.sync('devDependencies'))
  ];

  const dependencies = dependencyNames.map(name => {
    try{
      return resolve.sync(name);
    } catch (error) {
      logger.info(`Error trying to resolve dependency ${name}. Continuing...`);
    }
  }).filter(Boolean);

  if (includeGlobal) {
    const globalPackages = glob.sync('*/package.json', {cwd: globalModules,
      realpath: true});

    dependencies.push(...globalPackages);
  }

  dependencies.forEach(dependency => {
    const dependencyPath = path.dirname(dependency);
    const packageJsonPath = findUp.sync('package.json', { cwd: dependencyPath });
    const pkg = require(packageJsonPath);

    if (pkg.keywords && pkg.keywords.includes(keyword)) {
      const extensionPath = path.dirname(packageJsonPath);
      const extension = require(extensionPath);

      extension[registerFunction](object, dependencyPath);
    }
  });
};
