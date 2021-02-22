const plugins = [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    [
        'babel-plugin-import',
        {
            'libraryName': '@material-ui/core',
            // Use "'libraryDirectory': ''," if your bundler does not support ES modules
            'libraryDirectory': 'esm',
            'camel2DashComponentName': false
        },
        'core'
    ],
    [
        'babel-plugin-import',
        {
            'libraryName': '@material-ui/icons',
            // Use "'libraryDirectory': ''," if your bundler does not support ES modules
            'libraryDirectory': 'esm',
            'camel2DashComponentName': false
        },
        'icons'
    ]
];
const presets = [
    '@babel/preset-react',
    [
        '@babel/preset-env',
        {
            bugfixes: true,
            useBuiltIns: 'entry',
            corejs: 3,
        }
    ]
]

module.exports = {plugins,presets};
