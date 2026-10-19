//@ts-check
'use strict';

const path = require('path');

/**@type {import('webpack').Configuration}*/
const config = {
    target: 'web',
    entry: './src/panel/main.ts',
    output: {
        path: path.resolve(__dirname, 'media'),
        filename: 'main-bundle.js',
        libraryTarget: 'var',
        library: 'petApp',
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            path: require.resolve('path-browserify'),
            process: require.resolve('process'),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.json',
                        },
                    },
                ],
            },
        ],
    },
};

module.exports = config;
