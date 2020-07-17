const { CheckerPlugin } = require('awesome-typescript-loader');
const path = require('path');
const { join } = require('path');

module.exports = {
    target: "node",
    entry: {
        background: join(__dirname, 'src/background.ts'),
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.ts?$/,
                use: 'awesome-typescript-loader?{configFileName: "tsconfig.json"}',
            },
        ],
    },
    output: {
        path: join(__dirname, 'dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    plugins: [
        new CheckerPlugin(),
    ]
};