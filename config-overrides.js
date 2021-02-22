const {getBabelLoader, addLessLoader,useBabelRc,addBabelPlugins, addWebpackResolve, addWebpackPlugin, override} = require('customize-cra')
const path = require('path')
const {DuplicatesPlugin} = require('inspectpack/plugin')
const {plugins} = require('./.babelrc.js');
const CircularDependencyPlugin = require('circular-dependency-plugin')
/*
    Move 'node_modules' from position 0 to 1 in modules array to prioritize parent project's modules.
    Webpack will check the parent project's node_modules first to resolve dependencies in linked modules.
    This will prevent the bundle having duplicate modules.
    This happens only in development and for linked packages.
  Important!!!:
  This change may create build errors.
  Because some of the packages may have multiple versions.
  And webpack may choose the wrong one.
 */
const fixModuleResolutionForLinkedPackages = config => {
    if (config.mode === 'development') {
        const moveInArray = function (array, fromIndex, toIndex) {
            array.splice(toIndex, 0, array.splice(fromIndex, 1)[0])
        }
        moveInArray(config.resolve.modules, 0, 1)
    }
    return config
}

/*
    CRA doesn't compile external files.
    Here we're including the external eventdex-module source files in webpack/babel configuration.
    This way any change in eventdex-modules will instantly reflect in this app.
 */
const includeEventdexModulesInBabel = config => {
    const eventdexModulesSrcPath = path.resolve('../eventdex-modules/src/modules')
    let include = getBabelLoader(config).include
    if (Array.isArray(include)) {
        include.push(eventdexModulesSrcPath)
    } else {
        include = [include, eventdexModulesSrcPath]
    }
    getBabelLoader(config).include = include
    return config
}

module.exports = {
    webpack: override(
        useBabelRc(),
        addLessLoader({lessOptions:{relativeUrls:false}}),
        addBabelPlugins(...plugins),
        addWebpackResolve({symlinks: true}),
        addWebpackPlugin(
            new DuplicatesPlugin({
                // Emit compilation warning or error? (Default: `false`)
                emitErrors: false,
                // Display full duplicates information? (Default: `false`)
                verbose: false
            })
        ),
        addWebpackPlugin(
            new CircularDependencyPlugin({
                // exclude detection of files based on a RegExp
                exclude: /a\.js|node_modules/,
                // include specific files based on a RegExp
                include: /src/,
                // add errors to webpack instead of warnings
                failOnError: false,
                // allow import cycles that include an asyncronous import,
                // e.g. via import(/* webpackMode: "weak" */ './file.js')
                allowAsyncCycles: false,
                // set the current working directory for displaying module paths
                cwd: process.cwd(),
            })
        ),
        includeEventdexModulesInBabel,
        fixModuleResolutionForLinkedPackages,
        // (config)=>{console.log(config.module.rules[2].oneOf)}
    ),
    // The function to use to create a webpack dev server configuration when running the development
    // server with 'npm run start' or 'yarn start'.
    // Example: set the dev server to use a specific certificate in https.
    devServer: function (configFunction) {
        // Return the replacement function for create-react-app to use to generate the Webpack
        // Development Server config. "configFunction" is the function that would normally have
        // been used to generate the Webpack Development server config - you can use it to create
        // a starting configuration to then modify instead of having to create a config from scratch.
        return function (proxy, allowedHost) {
            // Create the default config by calling configFunction with the proxy/allowedHost parameters
            let config = configFunction(proxy, allowedHost)

            config.watchOptions = {
                ignored: [path.join(__dirname, 'node_modules/**'), path.join(__dirname, 'src/config/ConfigDebug.js')]
            }

            // Return your customised Webpack Development Server config.
            return config
        }
    },
}
