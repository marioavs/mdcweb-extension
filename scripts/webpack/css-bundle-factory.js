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
 * @fileoverview Creates Webpack bundle config objects to compile Sass files to CSS.
 */

'use strict';

const autoprefixer = require('autoprefixer');

class CssBundleFactory {
  constructor({
    env,
    pathResolver,
    globber,
    pluginFactory,
    autoprefixerLib = autoprefixer,
  } = {}) {
    /** @type {!Environment} */
    this.env_ = env;

    /** @type {!PathResolver} */
    this.pathResolver_ = pathResolver;

    /** @type {!Globber} */
    this.globber_ = globber;

    /** @type {!PluginFactory} */
    this.pluginFactory_ = pluginFactory;

    /** @type {function(opts: ...*=)} */
    this.autoprefixerLib_ = autoprefixerLib;
  }

  createCustomCss(
    {
      bundleName,
      mode = 'production',
      chunks,
      chunkGlobConfig: {
        inputDirectory = null,
        filePathPattern = '**/*.scss',
      } = {},
      output: {
        fsDirAbsolutePath = undefined, // Required for building the npm distribution and writing output files to disk
        httpDirAbsolutePath = undefined, // Required for running the demo server
        filenamePattern = this.env_.isProd() ? '[name].min.css' : '[name].css',
      },
      plugins = [],
    }) {
    chunks = chunks || this.globber_.getChunks({inputDirectory, filePathPattern});

    const fsCleanupPlugins = [];

    if (fsDirAbsolutePath) {
      fsCleanupPlugins.push(this.pluginFactory_.createCssCleanupPlugin({
        cleanupDirRelativePath: fsDirAbsolutePath,
      }));
    }

    const cssExtractorPlugin = this.pluginFactory_.createCssExtractorPlugin(filenamePattern);

    return {
      name: bundleName,
      mode,
      entry: chunks,
      output: {
        path: fsDirAbsolutePath,
        publicPath: httpDirAbsolutePath,
        filename: `${filenamePattern}.js`, // Webpack 3.x emits CSS wrapped in a JS file (cssExtractorPlugin unwraps it)
      },
      devtool: 'source-map',
      module: {
        rules: [{
          test: /\.scss$/,
          use: this.createCssLoader_(cssExtractorPlugin),
        }],
      },
      plugins: [
        cssExtractorPlugin,
        ...fsCleanupPlugins,
        ...plugins,
      ],
    };
  }

  createMainCssCombined(
    {
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins = [],
    }) {
    const getAbsolutePath = (...args) => this.pathResolver_.getAbsolutePath(...args);

    return this.createCustomCss({
      bundleName: 'main-css-combined',
      chunks: {
        'mdcweb-extension': getAbsolutePath('/packages/mdcweb-extension/mdcweb-extension.scss'),
      },
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins: [
        this.pluginFactory_.createCopyrightBannerPlugin(),
        ...plugins,
      ],
    });
  }

  createMainCssALaCarte(
    {
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins = [],
    }) {
    const getAbsolutePath = (...args) => this.pathResolver_.getAbsolutePath(...args);

    return this.createCustomCss({
      bundleName: 'main-css-a-la-carte',
      chunks: {
        'mdc-ext.data-table': getAbsolutePath('./packages/mdc-ext-data-table/mdc-ext-data-table.scss'),
        'mdc-ext.date-picker': getAbsolutePath('./packages/mdc-ext-date-picker/mdc-ext-date-picker.scss'),
        'mdc-ext.input-dialog': getAbsolutePath('./packages/mdc-ext-input-dialog/mdc-ext-input-dialog.scss'),
        'mdc-ext.multiselect': getAbsolutePath('./packages/mdc-ext-multiselect/mdc-ext-multiselect.scss'),
        'mdc-ext.pagination': getAbsolutePath('./packages/mdc-ext-pagination/mdc-ext-pagination.scss'),
        'mdc-ext.treeview': getAbsolutePath('./packages/mdc-ext-treeview/mdc-ext-treeview.scss'),
      },
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins: [
        this.pluginFactory_.createCopyrightBannerPlugin(),
        ...plugins,
      ],
    });
  }

  createCssLoader_(extractTextPlugin) {
    return extractTextPlugin.extract({
      use: [
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            plugins: () => [this.autoprefixerLib_({grid: false})],
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: this.globber_.getAbsolutePaths('packages/*/node_modules')
              .concat(this.globber_.getAbsolutePaths('node_modules')),
          },
        },
      ],
    });
  }
}

module.exports = CssBundleFactory;
