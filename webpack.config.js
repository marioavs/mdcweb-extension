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

'use strict';

const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const OUT_PATH = path.resolve('./build');
// Used with webpack-dev-server
const PUBLIC_PATH = '/assets/';
const IS_DEV = process.env.MDC_ENV === 'development';
const IS_PROD = process.env.MDC_ENV === 'production';

const banner = [
  '/*!',
  ' Material Components for the web',
  ` Copyright (c) ${new Date().getFullYear()} ...`,
  ' License: Apache-2.0',
  '*/',
].join('\n');

const createBannerPlugin = () => new webpack.BannerPlugin({
  banner: banner,
  raw: true,
  entryOnly: true,
});

const LIFECYCLE_EVENT = process.env.npm_lifecycle_event;
if (LIFECYCLE_EVENT == 'test' || LIFECYCLE_EVENT == 'test:watch') {
  process.env.BABEL_ENV = 'test';
}

const CSS_LOADER_CONFIG = [
  {
    loader: 'css-loader',
    options: {
      sourceMap: true
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: IS_DEV,
      plugins: () =>[require('autoprefixer')({grid: false})]
    }
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      includePaths: glob.sync('packages/*/node_modules').map((d) => path.join(__dirname, d))
    }
  }
];

module.exports = [{
  name: 'js-components',
  entry: {
    autocomplete: [path.resolve('./packages/mdc-ext-autocomplete/index.js')],
    table: [path.resolve('./packages/mdc-ext-table/index.js')]
  },
  output: {
    path: OUT_PATH,
    publicPath: PUBLIC_PATH,
    filename: 'mdc-ext.[name].' + (IS_PROD ? 'min.' : '') + 'js',
    libraryTarget: 'umd',
    library: ['mdcext', '[name]']
  },
  // See https://github.com/webpack/webpack-dev-server/issues/882
  // Because we only spin up dev servers temporarily, and all of our assets are publicly
  // available on GitHub, we can safely disable this check.
  devServer: {
    disableHostCheck: true
  },
  devtool: IS_DEV ? 'source-map' : false,
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules(?!\/@material)/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
    }]
  },
  plugins: [
    createBannerPlugin()
  ]
}, {
  name: 'js-all',
  entry: path.resolve('./packages/mdcweb-extension/index.js'),
  output: {
    path: OUT_PATH,
    publicPath: PUBLIC_PATH,
    filename: 'mdcweb-extension.' + (IS_PROD ? 'min.' : '') + 'js',
    libraryTarget: 'umd',
    library: 'mdcext'
  },
  devServer: {
    disableHostCheck: true
  },
  devtool: IS_DEV ? 'source-map' : false,
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules(?!\/@material)/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
    }]
  },
  plugins: [
    createBannerPlugin()
  ]
}, {
  name: 'css',
  entry: {
    'mdcweb-extension': path.resolve(
        './packages/mdcweb-extension/mdcweb-extension.scss'),
    'mdcext.autocomplete': path.resolve('./packages/mdc-ext-autocomplete/mdc-ext-autocomplete.scss'),
    'mdcext.table': path.resolve('./packages/mdc-ext-table/mdc-ext-table.scss')
  },
  output: {
    path: OUT_PATH,
    publicPath: PUBLIC_PATH,
    // In development, these are emitted as js files to facilitate hot module replacement. In
    // all other cases, ExtractTextPlugin is used to generate the final css, so this is given a
    // dummy ".css-entry" extension.
    filename: '[name].' + (IS_PROD ? 'min.' : '') + 'css' + (IS_DEV ? '.js' : '-entry')
  },
  devServer: {
    disableHostCheck: true
  },
  devtool: IS_DEV ? 'source-map' : false,
  module: {
    rules: [{
      test: /\.scss$/,
      use: IS_DEV ? [{loader: 'style-loader'}].concat(CSS_LOADER_CONFIG) : ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: CSS_LOADER_CONFIG
      })
    }]
  },
  plugins: [
    new ExtractTextPlugin('[name].' + (IS_PROD ? 'min.' : '') + 'css'),
    createBannerPlugin()
  ]
}];

if (IS_DEV) {
  module.exports.push({
    name: 'demo-css',
    entry: {
      'demo-styles': path.resolve('./demos/demos.scss'),
    },
    output: {
      path: OUT_PATH,
      publicPath: PUBLIC_PATH,
      filename: '[name].css.js'
    },
    devServer: {
      disableHostCheck: true
    },
    devtool: 'source-map',
    module: {
      rules: [{
        test: /\.scss$/,
        use: [{loader: 'style-loader'}].concat(CSS_LOADER_CONFIG)
      }]
    },
    plugins: [
      createBannerPlugin()
    ]
  });
}
