/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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
 * @fileoverview Rewrites JS to match a goog.module format. That means
 *  * Add goog.module to the top of the source code
 *  * Rewrite export {foo, bar} to exports = {foo, bar}
 *  * Rewrite export default Foo, to exports = Foo
 *  * Rewrite import Foo from './foo' to const Foo = goog.require('mdc.foo')
 *  * Rewrite import {foo, bar} from './util' to const {foo, bar} = goog.require('mdc.util')
 *
 *
 * This script rewrites import statements such that:
 *
 * ```js
 * import [<SPECIFIERS> from] '@material/$PKG[/files...]';
 * ```
 * becomes
 * ```js
 * const [<SPECIFIERS>] = goog.require('mdc.$PKG.<RESOLVED_FILE_NAMESPACE>');
 * ```
 * The RESOLVED_FILE_NAMESPACE is a namespace matching the directory structure.
 *
 * This script also handles third-party dependencies, e.g.
 *
 * ```js
 * import {thing1, thing2} from 'third-party-lib';
 * ```
 *
 * becomes
 *
 * ```js
 * const {thing1, thing2} = goog.require('goog:mdc.thirdparty.thirdPartyLib');
 * ```
 *
 * and
 *
 * ```js
 * import someDefaultExport from 'third-party-lib';
 * ```
 *
 * becomes
 *
 * ```js
 * const {someDefaultExport} = goog.require('goog:mdc.thirdparty.thirdPartyLib')
 * ```
 *
 * This is so closure is able to properly build and check our files without breaking when it encounters
 * node modules. Note that while closure does have a --module_resolution NODE flag
 * (https://github.com/google/closure-compiler/wiki/JS-Modules#node-resolution-mode),
 * it has inherent problems that prevents us from using it. See:
 * - https://github.com/google/closure-compiler/issues/2386
 *
 * Note that for third-party modules, they must be defined in closure_externs.js. See that file for more info.
 * Also note that this works on `export .... from ...` as well.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {default: traverse} = require('babel-traverse');
const babylon = require('babylon');
const camelCase = require('camel-case');
const glob = require('glob');
const recast = require('recast');
const resolve = require('resolve');
const t = require('babel-types');
const defaultTypesMap = {};

const libName = 'mdcext';
const libPrefix = 'mdc-ext';
const importPrefix = '@mdcext';
const importMaterial = '@material';

main(process.argv);

function main(argv) {
  if (argv.length < 3) {
    console.error('Missing root directory path');
    process.exit(1);
  }

  const rootDir = path.resolve(process.argv[2]);
  let srcFiles = glob.sync(`${rootDir}/**/*.js`);
  srcFiles = srcFiles.filter((name) => !name.includes('node_modules') || name.includes('@material'));

  // first pass, construct a map of default exports (adapters, foundations,
  // components).
  srcFiles.forEach((srcFile) => visit(srcFile, rootDir));
  logProgress('');
  console.log('\rVisit pass completed. ' + Object.keys(defaultTypesMap).length + ' default types found.\n');

  // second pass, rewrite exports, rewrite imports with goog.require, and add goog.module declarations
  srcFiles.forEach((srcFile) => transform(srcFile, rootDir));
  logProgress('');
  console.log('\rTransform pass completed. ' + srcFiles.length + ' files written.\n');
}

function visit(srcFile, rootDir) {
  const src = fs.readFileSync(srcFile, 'utf8');
  logProgress(`[processing] ${srcFile}`);
  const ast = recast.parse(src, {
    parser: {
      parse: (code) => babylon.parse(code, {sourceType: 'module'}),
    },
  });

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const pathbasedPackageName = getPathbasedPackage(rootDir, srcFile);
      const packageNameParts = pathbasedPackageName.split('.');
      packageNameParts.pop();
      packageNameParts.push(path.node.declaration.name);
      const packageName = packageNameParts.join('.');
      defaultTypesMap[pathbasedPackageName] = packageName;
    },
  });
}

function transform(srcFile, rootDir) {
  const src = fs.readFileSync(srcFile, 'utf8');
  const ast = recast.parse(src, {
    parser: {
      parse: (code) => babylon.parse(code, {sourceType: 'module'}),
    },
  });

  traverse(ast, {
    ExportNamedDeclaration(path) {
      const properties = [];
      path.node.specifiers.forEach((specifier) => {
        properties.push(t.objectProperty(specifier.exported, specifier.exported, false, true, []));
      });
      const right = t.objectExpression(properties);
      const expression = t.assignmentExpression('=', t.identifier('exports'), right);
      path.replaceWith(t.expressionStatement(expression));
    },
  });

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const expression = t.assignmentExpression('=', t.identifier('exports'), path.node.declaration);
      path.replaceWith(t.expressionStatement(expression));
    },
  });

  traverse(ast, {
    ImportDeclaration(path) {
      const callee = t.memberExpression(t.identifier('goog'), t.identifier('require'), false);
      const packageStr = rewriteDeclarationSource(path.node, srcFile, rootDir);
      const callExpression = t.callExpression(callee, [t.stringLiteral(packageStr)]);

      let variableDeclaratorId;
      if (path.node.specifiers.length > 1 || (src.substr(path.node.specifiers[0].start - 1, 1) === '{')) {
        const properties = [];
        path.node.specifiers.forEach((specifier) => {
          properties.push(t.objectProperty(specifier.local, specifier.local, false, true, []));
        });
        variableDeclaratorId = t.objectPattern(properties);
      } else {
        variableDeclaratorId = path.node.specifiers[0].local;
      }

      const variableDeclarator = t.variableDeclarator(variableDeclaratorId, callExpression);
      const variableDeclaration = t.variableDeclaration('const', [variableDeclarator]);
      // Preserve comments above import statements, since this is most likely
      // the license comment.
      if (path.node.comments && path.node.comments.length > 0) {
        for (let i = 0; i < path.node.comments.length; i++) {
          const commentValue = path.node.comments[i].value;
          variableDeclaration.comments = variableDeclaration.comments || [];
          variableDeclaration.comments.push({type: 'CommentBlock', value: commentValue});
        }
      }
      path.replaceWith(variableDeclaration);
    },

    ClassMethod(path) {
      // Remove any statements from abstract function bodies.
      // Closure doesn't like seeing this, but we like to include a throw statement for non-closure clients.
      if (path.node.comments && path.node.comments.some((comment) => comment.value.includes('@abstract'))) {
        path.node.body.body = [];
      }
    },
  });

  let {code: outputCode} = recast.print(ast, {
    objectCurlySpacing: false,
    quote: 'single',
    trailingComma: {
      objects: false,
      arrays: true,
      parameters: false,
    },
  });

  let packageStr = '';
  const pathbasedPackageName = getPathbasedPackage(rootDir, srcFile);
  if (pathbasedPackageName in defaultTypesMap) {
    packageStr = defaultTypesMap[pathbasedPackageName];
  } else {
    packageStr = pathbasedPackageName;
  }

  // Specify goog.module after the @license comment and append newline at the end of the file.
  const pos = outputCode.indexOf(' */') + 3;
  outputCode = outputCode.substr(0, pos) + '\ngoog.module(\'' + packageStr + '\');\n' + outputCode.substr(pos) + '\n';
  fs.writeFileSync(srcFile, outputCode, 'utf8');
  logProgress(`[rewrite] ${srcFile}`);
}

function rewriteDeclarationSource(node, srcFile, rootDir) {
  let source = node.source.value;
  const pathParts = source.split('/');
  const isLibImport = pathParts[0] === importPrefix;
  const isMDCImport = pathParts[0] === importMaterial;
  if (isLibImport) {
    const modName = pathParts[1]; // <importPrefix>/<modName>
    const atMaterialReplacementPath = `${rootDir}/mdc-ext-${modName}`;
    const rewrittenSource = [atMaterialReplacementPath].concat(pathParts.slice(2)).join('/');
    source = rewrittenSource;
  } else if (isMDCImport) {
    const modName = pathParts[1]; // <importMaterial>/<modName>
    const atMaterialReplacementPath = `${importMaterial}/${modName}`;
    const rewrittenSource = [atMaterialReplacementPath].concat(pathParts.slice(2)).join('/');
    source = rewrittenSource;
  }

  return patchNodeForDeclarationSource(source, srcFile, rootDir, node);
}

function patchNodeForDeclarationSource(source, srcFile, rootDir, node) {
  let resolvedSource = source;
  // See: https://nodejs.org/api/modules.html#modules_all_together (step 3)
  const wouldLoadAsFileOrDir = ['./', '/', '../', importMaterial].some((s) => source.indexOf(s) === 0);
  const isThirdPartyModule = !wouldLoadAsFileOrDir;
  if (isThirdPartyModule) {
    assert(source.indexOf(importPrefix) < 0, `${importPrefix}/* import sources should have already been rewritten`);
    patchDefaultImportIfNeeded(node);
    resolvedSource = `${libName}.thirdparty.${camelCase(source)}`;
  } else {
    const normPath = path.normalize(path.dirname(srcFile), source);
    const needsClosureModuleRootResolution = path.isAbsolute(source) || fs.statSync(normPath).isDirectory();
    if (needsClosureModuleRootResolution) {
      resolvedSource = path.relative(rootDir, resolve.sync(source, {
        basedir: path.dirname(srcFile),
      }));
    }
  }
  const packageParts = resolvedSource.replace(`${libPrefix}-`, '').replace(/-/g, '').replace('.js', '').split('/');
  const packageStr = (!isThirdPartyModule ? `${libName}.` : '') + packageParts.join('.').replace('.index', '');
  if (packageStr in defaultTypesMap) {
    return defaultTypesMap[packageStr];
  }
  return packageStr;
}

function patchDefaultImportIfNeeded(node) {
  const defaultImportSpecifierIndex =
      node.specifiers.findIndex(t.isImportDefaultSpecifier);
  if (defaultImportSpecifierIndex >= 0) {
    const defaultImportSpecifier = node.specifiers[defaultImportSpecifierIndex];
    const defaultPropImportSpecifier = t.importSpecifier(defaultImportSpecifier.local, t.identifier('default'));
    node.specifiers[defaultImportSpecifierIndex] = defaultPropImportSpecifier;
  }
}

function getPathbasedPackage(rootDir, srcFile) {
  const relativePath = path.relative(rootDir, srcFile);
  const packageParts = relativePath.replace(`${libPrefix}-`, '').replace(/-/g, '').replace('.js', '').split('/');
  const packageStr = `${libName}.` + packageParts.join('.').replace('.index', '');
  return packageStr;
}

function logProgress(msg) {
  if (logProgress.__prev_msg_length) {
    const lineClear = ' '.repeat(logProgress.__prev_msg_length + 10);
    process.stdout.write('\r' + lineClear);
  }
  logProgress.__prev_msg_length = msg.length;
  process.stdout.write('\r' + msg);
}
