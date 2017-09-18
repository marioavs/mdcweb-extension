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

 /** @const {string} */
const ROOT = 'mdc-ext-treeview';

/** @enum {string} */
export const cssClasses = {
  ROOT: ROOT,
  DISABLED: `${ROOT}--disabled`,
  TREEVIEW_NODE: `${ROOT}-node`,
  TREEVIEW_ROW: `${ROOT}-row`,
  UPGRADED: `${ROOT}--upgraded`
};

/** @enum {string} */
export const strings = {
  CHECKBOX_SELECTOR: `.${ROOT}-checkbox__native-control`,
  ROW_NATIVE_CONTROL_SELECTOR: `.${ROOT}-item .${ROOT}-checkbox__native-control`,
  ROW_SELECTOR: `.${ROOT}-row`,
  TOGGLE_SELECTOR: `.${ROOT}-toggle`,
  ARIA_DISABLED: 'aria-disabled',
  CHANGE_EVENT: 'MDCExtTreeview:change',
  DATA_CONTROL_STATE_ATTR: 'data-controlstate',
  TOGGLE_EVENT: 'MDCExtTreeview:toggle',
  TRANSITION_STATE_CHECKED: 'checked',
  TRANSITION_STATE_UNCHECKED: 'unchecked',
  TRANSITION_STATE_INDETERMINATE: 'indeterminate'
};
