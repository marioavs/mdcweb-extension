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
const ROOT = 'mdc-ext-multiselect';

/** @enum {string} */
export const cssClasses = {
  ROOT: ROOT,
  DISABLED: `${ROOT}--disabled`,
  FOCUSED: `${ROOT}--focused`,
  INVALID: `${ROOT}--invalid`,
  LABEL_FLOAT_ABOVE: `${ROOT}__label--float-above`,
  LIST_OPEN: `${ROOT}__list--open`,
  OPEN: `${ROOT}--open`,
  SELECTED_OPTION: `${ROOT}__option`,
  UPGRADED: `${ROOT}--upgraded`,
  HELPTEXT_PERSISTENT: `${ROOT}-helptext--persistent`,
  HELPTEXT_VALIDATION_MSG: `${ROOT}-helptext--validation-msg`,
  ITEM_ACTIVE: 'mdc-list-item--active',
  ITEM_NOMATCH: 'mdc-list-item__nomatch',
  LIST_ITEM: 'mdc-list-item'
};

/** @enum {string} */
export const strings = {
  COMBOBOX_SELECTOR: `.${ROOT}__combobox`,
  COMBOBOX_BACKGROUND_SELECTOR: `.${ROOT}__combobox-background`,
  DISPLAY_SELECTOR: `.${ROOT}__display`,
  INPUT_SELECTOR: `.${ROOT}__input`,
  ITEM_SELECTOR: '.mdc-list-item',
  LABEL_SELECTOR: `.${ROOT}__label`,
  LIST_SELECTOR: `.${ROOT}__list`,
  SELECT_SELECTOR: `.${ROOT}__select`,
  ALERT_ROLE: 'alert',
  ARIA_CONTROLS: 'aria-controls',
  ARIA_DISABLED: 'aria-disabled',
  ARIA_HIDDEN: 'aria-hidden',
  ARIA_SELECTED_ATTR: 'aria-selected',
  AUTOCOMPLETE: 'autocomplete',
  CHANGE_EVENT: 'MDCExtMultiselect:change',
  ITEM_DATA_VALUE_ATTR: 'data-value',
  ITEM_DATA_DESC_ATTR: 'data-description',
  MAXLENGTH: 'maxlength',
  ROLE: 'role',
  SELECTED_ATTR: 'selected'
};

/** @enum {number} */
export const numbers = {
  // Amount of miliseconds to wait before triggering a change value functionality.
  CHANGE_VALUE_TRIGGER_DELAY: 500
}
