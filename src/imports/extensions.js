import findUp from 'find-up';
import path from 'path';
import pkgConf from 'pkg-conf';
import resolve from 'resolve';

/**
 * @module extensions
 */


/**
 * Structure dependencies object with dependency name and path
 *
 * @name structureDependencies
 * @function
 * @param {Object} dependencies Dependencies and version numbers taken from packages.json
 * @param {String} path Path to dependencies
 * @returns {Array}
 */
const structureDependencies = (dependencies, dependencyPath) => (
  Object.keys(dependencies).map(dependency => (
    {
      basedir: dependencyPath,
      name: dependency,
    }
  ))
);

/**
 * Get core dependencies
 *
 * @name getCoreDependencies
 * @function
 * @returns {Array} Core dependencies with core root path
 */
const getCoreDependencies = () => {
  const packageJsonPath = findUp.sync('package.json', { cwd: __dirname });
  const coreDirectory = !packageJsonPath ? false : path.dirname(packageJsonPath);
  const coreDevDependencies = pkgConf.sync('devDependencies', { cwd: coreDirectory });

  return structureDependencies(coreDevDependencies, coreDirectory);
};

/**
 * Check if module is a Stanza extension
 *
 * @name checkIfStanzaExtension
 * @function
 * @param {String} dependencyPath Path to module
 * @param {Object} object Object to pass to the register function
 * @param {string} keyword Keyword to use when searching for extensions to register
 * @param {string} registerFunction Name of the register function used during extension registration
 * @returns {undefinded}
 */
const checkIfStanzaExtension = (dependencyPath, object, keyword, registerFunction) => {
  const dependencyPackageJsonPath = findUp.sync('package.json', { cwd: dependencyPath });
  const dependencyPackageJson = require(dependencyPackageJsonPath);
  const keywords = dependencyPackageJson.keywords || [];


  if (keywords.includes(keyword)) {
    const extensionPath = path.dirname(dependencyPackageJsonPath);
    const extension = require(extensionPath);

    extension[registerFunction](object, dependencyPath);
  }
};

/**
 * Searches for dev dependencies for a Stanza project with an optional flag to
 * search for globally installed modules. Passes an object
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
  const devDependenciesWithPath = structureDependencies(devDependencies, global.APP_ROOT_PATH);

  const coreDevDependenciesWithPath = registerGlobal
    ? getCoreDependencies()
    : {};

  const allDependencies = [
    ...coreDevDependenciesWithPath,
    ...devDependenciesWithPath,
  ];

  allDependencies.forEach(dependency => {
    const { basedir, name } = dependency;

    try {
      const dependencyPath = resolve.sync(name, { basedir });

      checkIfStanzaExtension(dependencyPath, object, keyword, registerFunction);
    } catch (error) {
      console.log(`Error trying to resolve dependency ${name}. Continuing...`);
    }
  });
};
