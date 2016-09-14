import findUp from 'find-up';
import glob from 'glob';
import globalModules from 'global-modules';
import path from 'path';
import pkgConf from 'pkg-conf';
import resolve from 'resolve';
import logger from './logger';

/**
 * Searches project dependencies for modules that contain the passed keyword
 * with an optional parameter to search globally installed modules as well.
 * Passes an object into the register function of the resultant extensions
 * allowing those extensions to register themselves against the passed object.
 *
 * @param {string} keyword - Keyword to use when searching for extensions to
 * register.
 * @param {Object} object - Object to pass to the register function.
 * @param {Object} options - Object with optional paramsts
 * @param {boolean} options[includeGlobal=false] - Determines if global packages
 * should be registered.
 * @param {string} options[registerFunction=register] - Name of the register function
 * used during extension registration.
 */
const registerExtensions = (keyword, object, options = {}) => {
  const includeGlobal = options.includeGlobal || false;
  const registerFunction = options.registerFunction || 'register';

  const dependencyNames = [
    ...Object.keys(pkgConf.sync('dependencies')),
    ...Object.keys(pkgConf.sync('devDependencies')),
  ];

  const dependencies = dependencyNames.map(name => {
    let dependencyPath = undefined;

    const resolveOptions = {};

    if (object.projectRoot) {
      resolveOptions.basedir = object.projectRoot;
    }

    try {
      dependencyPath = resolve.sync(name, resolveOptions);
    } catch (error) {
      logger.info(`Error trying to resolve dependency ${name}. Continuing...`);
    }

    return dependencyPath;
  }).filter(Boolean);

  if (includeGlobal) {
    const globalPackages = glob.sync(
      '*/package.json',
      {
        cwd: globalModules,
        realpath: true,
      }
    );

    dependencies.push(...globalPackages);
  }

  return dependencies.map(dependency => {
    let registeredExtension = undefined;

    const dependencyPath = path.dirname(dependency);
    const packageJsonPath = findUp.sync('package.json', { cwd: dependencyPath });
    const pkg = require(packageJsonPath); // eslint-disable-line global-require

    if (pkg.keywords && pkg.keywords.includes(keyword)) {
      const extensionPath = path.dirname(packageJsonPath);
      const extension = require(extensionPath); // eslint-disable-line global-require

      if (extension[registerFunction]) {
        registeredExtension = extension[registerFunction](object, keyword);
      } else {
        logger.warn(`No register function found for extension ${dependency}`);
      }
    }

    return registeredExtension;
  }).filter(Boolean);
};

export default registerExtensions;
