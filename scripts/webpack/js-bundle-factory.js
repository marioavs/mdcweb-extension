/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Creates Webpack bundle config objects to compile ES2015 JavaScript to ES5.
 */

'use strict';

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
      mode = 'production',
      chunks,
      chunkGlobConfig: {
        inputDirectory = null,
        filePathPattern = '**/*.js',
      } = {},
      output: {
        fsDirAbsolutePath = undefined, // Required for building the npm distribution and writing output files to disk
        httpDirAbsolutePath = undefined, // Required for running the demo server
        filenamePattern = this.env_.isProd() ? '[name].min.js' : '[name].js',
        library,
      },
      plugins = [],
    }) {
    chunks = chunks || this.globber_.getChunks({inputDirectory, filePathPattern});

    return {
      name: bundleName,
      mode,
      entry: chunks,
      output: {
        path: fsDirAbsolutePath,
        publicPath: httpDirAbsolutePath,
        filename: filenamePattern,
        libraryTarget: 'umd',
        library,
      },
      devtool: 'source-map',
      module: {
        rules: [{
          test: /\.js$/,
          exclude: /node_modules\/(?!(@material)\/).*/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        }],
      },
      plugins: [
        ...plugins,
      ],
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
      chunks: getAbsolutePath('/packages/mdcweb-extension/index.js'),
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
        filenamePattern: this.env_.isProd() ? 'mdcweb-extension.min.js' : 'mdcweb-extension.js',
        library: 'mdcext',
      },
      plugins: [
        this.pluginFactory_.createCopyrightBannerPlugin(),
        ...plugins,
      ],
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
        datePicker: getAbsolutePath('./packages/mdc-ext-date-picker/index.js'),
        inputDialog: getAbsolutePath('./packages/mdc-ext-input-dialog/index.js'),
        multiselect: getAbsolutePath('./packages/mdc-ext-multiselect/index.js'),
        pagination: getAbsolutePath('./packages/mdc-ext-pagination/index.js'),
        treeview: getAbsolutePath('./packages/mdc-ext-treeview/index.js')
      },
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
        filenamePattern: this.env_.isProd() ? 'mdc-ext.[name].min.js' : 'mdc.[name].js',
        library: ['mdcext', '[name]'],
      },
      plugins: [
        this.pluginFactory_.createCopyrightBannerPlugin(),
        ...plugins,
      ],
    });
  }
}

module.exports = JsBundleFactory;
