const {override, useBabelRc} = require("customize-cra");
const {
    circularDependencyPlugin, bundleAnalyzerPlugin, duplicatesPlugin, printConfig,
    fixModuleResolutionForLinkedPackages, addPolyfills,
} = require("@eventdex/bootstrap/src/hostConfig/config-overrides")

//Add babel aliases to be able to include external code (../eventdex-modules)
const {aliasDangerous, configPaths} = require("react-app-rewire-alias/lib/aliasDangerous")
const aliasMap = configPaths("./tsconfig.paths.json") // or jsconfig.paths.json
const addAliases = aliasDangerous(aliasMap)

module.exports = {
    webpack: override(
        addAliases,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useBabelRc(),
        duplicatesPlugin,
        circularDependencyPlugin,
        fixModuleResolutionForLinkedPackages,
        bundleAnalyzerPlugin,
        addPolyfills(["util"]),
        printConfig()
    ),
};
