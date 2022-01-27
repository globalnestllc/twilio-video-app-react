const plugins = [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["babel-plugin-direct-import", {modules: ["@mui/material", "@mui/icons-material"]}],
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
