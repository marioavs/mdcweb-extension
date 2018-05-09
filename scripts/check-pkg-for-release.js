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
 * @fileoverview Used within pre-release.sh, this checks a component's package.json
 * to ensure that if it's a new component (version = "0.0.0"), it will have a proper
 * "publishConfig.access" property set to "public".
 * The argument should be the package.json file to check.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {default: traverse} = require('babel-traverse');
const babylon = require('babylon');
const camelCase = require('camel-case');
const cssom = require('cssom');
const recast = require('recast');

const pkg = require(path.join(process.env.PWD, process.argv[process.argv.length - 1]));

const REPO_PKG = require(path.join(process.env.PWD, 'package.json'));
const WEBPACK_CONFIG_PATH = 'webpack.config.js';
const WEBPACK_CONFIG = require(path.join(process.env.PWD, WEBPACK_CONFIG_PATH));
const MASTER_PKG_PATH = 'packages/mdcweb-extension/package.json';
const MASTER_CSS_PATH = 'packages/mdcweb-extension/mdcweb-extension.scss';
const MASTER_JS_PATH = 'packages/mdcweb-extension/index.js';
const MASTER_PKG = require(path.join(process.env.PWD, MASTER_PKG_PATH));
// These few MDC packages work as foundation or utility packages, and are not
// directly included in webpack or the material-component-web module. But they
// are necessary since other MDC packages depend on them.
const CSS_WHITELIST = [];

main();

function main() {
  checkPublicConfigForNewComponent();
  if (pkg.name !== MASTER_PKG.name) {
    checkNameIsPresentInAllowedScope();
    if (pkg.private) {
      console.log('Skipping private component', pkg.name);
    } else {
      checkDependencyAddedInWebpackConfig();
      checkDependencyAddedInMDCPackage();
    }
  }
}

function checkPublicConfigForNewComponent() {
  if (pkg.version === '0.0.0') {
    assert.notEqual(typeof pkg.publishConfig, 'undefined',
      'Please add publishConfig to' + pkg.name + '\'s package.json. Consult our ' +
      'docs/authoring-components.md to ensure your component\'s package.json ' +
      'is well-formed.');
    assert.equal(pkg.publishConfig.access, 'public',
      'Please set publishConfig.access to "public" in ' + pkg.name + '\'s package.json. ' +
      'Consult our docs/authoring-components.md to ensure your component\'s package.json ' +
      'is well-formed.');
  }
}

function checkNameIsPresentInAllowedScope() {
  const name = getPkgName();
  assert.notEqual(REPO_PKG.config['validate-commit-msg']['scope']['allowed'].indexOf(name), -1,
    'FAILURE: Component ' + pkg.name + ' is not added to allowed scope. Please check package.json ' +
    'and add ' + name + ' to config["validate-commit-msg"]["scope"]["allowed"] before commit.');
}

function checkDependencyAddedInWebpackConfig() {
  // Check if css has been added to webpack config
  checkCSSDependencyAddedInWebpackConfig();

  // Check if js component has been added to webpack config
  if (typeof(pkg.main) !== 'undefined') {
    checkJSDependencyAddedInWebpackConfig();
  }
}

function checkJSDependencyAddedInWebpackConfig() {
  const jsconfig = WEBPACK_CONFIG.find((value) => {
    return value.name === 'main-js-a-la-carte';
  });
  const nameCamel = camelCase(pkg.name.replace('@mdcext/', ''));
  assert.notEqual(typeof jsconfig.entry[nameCamel], 'undefined',
    'FAILURE: Component ' + pkg.name + ' javascript dependency is not added to webpack ' +
    'configuration. Please add ' + nameCamel + ' to ' + WEBPACK_CONFIG_PATH + '\'s js-components ' +
    'entry before commit.');
}

function checkCSSDependencyAddedInWebpackConfig() {
  const name = getPkgName();
  if (CSS_WHITELIST.indexOf(name) === -1) {
    const cssconfig = WEBPACK_CONFIG.find((value) => {
      return value.name === 'main-css-a-la-carte';
    });
    const nameMDC = pkg.name.replace('@mdcext/', 'mdc-ext.');
    assert.notEqual(typeof cssconfig.entry[nameMDC], 'undefined',
      'FAILURE: Component ' + pkg.name + ' css dependency not added to webpack ' +
      'configuration. Please add ' + name + ' to ' + WEBPACK_CONFIG_PATH + '\'s css ' +
      'entry before commit.');
  }
}

function checkDependencyAddedInMDCPackage() {
  // Package is added to package.json
  checkPkgDependencyAddedInMDCPackage();

  // SCSS is added to @import rule
  checkCSSDependencyAddedInMDCPackage();

  // If any, foundation is added to index and autoInit
  checkJSDependencyAddedInMDCPackage();
}

function checkPkgDependencyAddedInMDCPackage() {
  assert.notEqual(typeof MASTER_PKG.dependencies[pkg.name], 'undefined',
    'FAILURE: Component ' + pkg.name + ' is not a denpendency for MDC Web. ' +
    'Please add ' + pkg.name +' to ' + MASTER_PKG_PATH + '\' dependencies before commit.');
}

function checkCSSDependencyAddedInMDCPackage() {
  const name = getPkgName();
  const nameMDC = `mdc-ext-${name}`;
  if (CSS_WHITELIST.indexOf(name) === -1) {
    const src = fs.readFileSync(path.join(process.env.PWD, MASTER_CSS_PATH), 'utf8');
    const cssRules = cssom.parse(src).cssRules;
    const cssRule = path.join(pkg.name, nameMDC);

    assert.notEqual(typeof cssRules.find((value) => {
      return value.href === cssRule;
    }), 'undefined',
    'FAILURE: Component ' + pkg.name + ' is not being imported in MDC Web. ' +
    'Please add ' + name + ' to ' + MASTER_CSS_PATH + ' import rule before commit.');
  }
}

function checkJSDependencyAddedInMDCPackage() {
  const NOT_IMPORTED = ['animation'];
  const NOT_AUTOINIT = ['auto-init', 'base', 'selection-control'];
  const name = getPkgName();
  if (typeof(pkg.main) !== 'undefined' && NOT_IMPORTED.indexOf(name) === -1) {
    const nameCamel = camelCase(pkg.name.replace('@mdcext/', ''));
    const src = fs.readFileSync(path.join(process.env.PWD, MASTER_JS_PATH), 'utf8');
    const ast = recast.parse(src, {
      parser: {
        parse: (code) => babylon.parse(code, {sourceType: 'module'}),
      },
    });
    assert(checkComponentImportedAddedInMDCPackage(ast), 'FAILURE: Component ' +
      pkg.name + ' is not being imported in MDC Web. ' + 'Please add ' + nameCamel +
      ' to '+ MASTER_JS_PATH + ' import rule before commit.');
    assert(checkComponentExportedAddedInMDCPackage(ast), 'FAILURE: Component ' +
      pkg.name + ' is not being exported in MDC Web. ' + 'Please add ' + nameCamel +
      ' to '+ MASTER_JS_PATH + ' export before commit.');
    if (NOT_AUTOINIT.indexOf(name) === -1) {
      assert(checkAutoInitAddedInMDCPackage(ast) > 0, 'FAILURE: Component ' +
        pkg.name + ' seems not being auto inited in MDC Web. ' + 'Please add ' +
        nameCamel + ' to '+ MASTER_JS_PATH + ' autoInit statement before commit.');
    }
  }
}

function checkComponentImportedAddedInMDCPackage(ast) {
  let isImported = false;
  traverse(ast, {
    'ImportDeclaration'({node}) {
      if (node.source) {
        const source = node.source.value;
        if (source === pkg.name + '/index') {
          isImported = true;
        }
      }
    },
  });
  return isImported;
}

function checkAutoInitAddedInMDCPackage(ast) {
  let nameCamel = camelCase(pkg.name.replace('@mdcext/', ''));
  if (nameCamel === 'textfield') {
    nameCamel = 'textField';
  }
  let autoInitedCount = 0;
  traverse(ast, {
    'ExpressionStatement'({node}) {
      const callee = node.expression.callee;
      const args = node.expression.arguments;
      if (callee.object.name === 'autoInit' && callee.property.name === 'register') {
        const expression = args.find((value) => {
          return value.type === 'MemberExpression';
        });
        if (expression.object.name === nameCamel) {
          autoInitedCount++;
        }
      }
    },
  });
  return autoInitedCount;
}

function checkComponentExportedAddedInMDCPackage(ast) {
  let nameCamel = camelCase(pkg.name.replace('@mdcext/', ''));
  if (nameCamel === 'textfield') {
    nameCamel = 'textField';
  }
  let isExported = false;
  traverse(ast, {
    'ExportNamedDeclaration'({node}) {
      if (node.specifiers) {
        if (node.specifiers.find((value) => {
          return value.exported.name === nameCamel;
        })) {
          isExported = true;
        }
      }
    },
  });
  return isExported;
}

function getPkgName() {
  let name = pkg.name.split('/')[1];
  if (name === 'textfield') {
    // Text-field now has a dash in the name. The package cannot be changed,
    // since it is a lot of effort to rename npm package
    name = 'text-field';
  }
  return name;
}
