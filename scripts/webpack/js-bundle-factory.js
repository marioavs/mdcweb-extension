/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @fileoverview Creates Webpack bundle config objects to compile ES2015 JavaScript to ES5.
 */

'use strict';

const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

class JsBundleFactory {
  constructor({
    env,
    pathResolver,
    globber,
    pluginFactory,
  } = {}) {
    /** @type {!Environment} */
    this.env_ = env;

    /** @type {!PathResolver} */
    this.pathResolver_ = pathResolver;

    /** @type {!Globber} */
    this.globber_ = globber;

    /** @type {!PluginFactory} */
    this.pluginFactory_ = pluginFactory;
  }

  createCustomJs(
    {
      bundleName,
      chunks,
      extensions = ['.ts', '.js'],
      chunkGlobConfig: {
        inputDirectory = null,
        filePathPattern = '**/*.js',
      } = {},
      output: {
        fsDirAbsolutePath = undefined, // Required for building the npm distribution and writing output files to disk
        httpDirAbsolutePath = undefined, // Required for running the catalog server
        filenamePattern = this.env_.isProd() ? '[name].min.js' : '[name].js',
        library,
        globalObject = 'this',
      },
      rules= [],
      plugins = [],
      tsConfigFilePath = path.resolve(__dirname, '../../tsconfig.json'),
    }) {
    chunks = chunks || this.globber_.getChunks({inputDirectory, filePathPattern});

    const babelLoader = {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    };

    const uglifyOptions = {
      output: {
        comments: false, // Removes repeated @license comments and other code comments.
      },
      sourceMap: true,
    };

    const commonPlugins = [
      this.pluginFactory_.createCopyrightBannerPlugin(),
    ];

    return {
      name: bundleName,
      entry: chunks,
      output: {
        path: fsDirAbsolutePath,
        publicPath: httpDirAbsolutePath,
        filename: filenamePattern,
        libraryTarget: 'umd',
        library,
        globalObject,
      },
      resolve: { extensions },
      devtool: 'source-map',
      module: {
        rules: [
          {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
              babelLoader,
              {
                loader: 'ts-loader',
                options: { configFile: tsConfigFilePath },
              },
            ],
          }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [babelLoader],
          },
          ...rules,
        ],
      },
      optimization: {
        minimize: this.env_.isProd(),
        minimizer: [new UglifyJSPlugin({ uglifyOptions })],
      },
      plugins: [
        ...commonPlugins,
        ...plugins,
      ],
      watchOptions: {
        ignored: /node_modules/ // Avoid webpack-dev-server to watch many file
      }
    };
  }

  createMainJsCombined(
    {
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins = [],
    }) {
    const getAbsolutePath = (...args) => this.pathResolver_.getAbsolutePath(...args);

    return this.createCustomJs({
      bundleName: 'main-js-combined',
      chunks: getAbsolutePath('/packages/mdcweb-extension/index.ts'),
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
        filenamePattern: this.env_.isProd() ? 'mdcweb-extension.min.js' : 'mdcweb-extension.js',
        library: 'mdcext',
      },
      plugins,
    });
  }

  createMainJsALaCarte(
    {
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins = [],
    }) {
    const getAbsolutePath = (...args) => this.pathResolver_.getAbsolutePath(...args);

    return this.createCustomJs({
      bundleName: 'main-js-a-la-carte',
      chunks: {
        // datePicker: getAbsolutePath('./packages/mdc-ext-date-picker/index.ts'),
        // multiselect: getAbsolutePath('./packages/mdc-ext-multiselect/index.ts'),
        // pagination: getAbsolutePath('./packages/mdc-ext-pagination/index.ts'),
        treeview: getAbsolutePath('./packages/mdc-ext-treeview/index.ts'),
      },
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
        filenamePattern: this.env_.isProd() ? 'mdc-ext.[name].min.js' : 'mdc-ext.[name].js',
        library: ['mdcext', '[name]'],
      },
      plugins,
    });
  }
}

module.exports = JsBundleFactory;
