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
 * @fileoverview Factory for Webpack plugins. Allows us to more easily mock and test our config generator code.
 */

'use strict';

const CopyrightBannerPlugin = require('./copyright-banner-plugin');
const CssCleanupPlugin = require('./css-cleanup-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class PluginFactory {
  constructor({globber} = {}) {
    this.globber_ = globber;
  }

  createCopyrightBannerPlugin() {
    return new CopyrightBannerPlugin();
  }

  createCssCleanupPlugin({cleanupDirRelativePath} = {}) {
    return new CssCleanupPlugin({
      cleanupDirRelativePath,
      globber: this.globber_,
    });
  }

  createCssExtractorPlugin(filename) {
    return new MiniCssExtractPlugin({filename});
  }
}

module.exports = PluginFactory;
