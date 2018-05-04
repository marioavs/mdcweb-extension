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
 * @fileoverview Webpack plugin that adds a copyright notice at the top of all output files.
 */

'use strict';

const webpack = require('webpack');

class CopyrightBannerPlugin extends webpack.BannerPlugin {
  constructor({projectName, authorName, licenseName}) {
    super({
      banner: [
        '/*!',
        ` ${projectName}`,
        ` Copyright (c) ${new Date().getFullYear()} ${authorName}`,
        ` License: ${licenseName}`,
        '*/',
      ].join('\n'),
      raw: true,
      entryOnly: true,
    });
  }
}

module.exports = CopyrightBannerPlugin;
