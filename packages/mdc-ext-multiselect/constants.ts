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
const cssClasses = {
  ROOT: ROOT,
  DISABLED: `${ROOT}--disabled`,
  FOCUSED: `${ROOT}--focused`,
  INPUT: `${ROOT}__input`,
  INVALID: `${ROOT}--invalid`,
  ITEM_NOMATCH: 'mdc-list-item__nomatch',
  ITEM_SELECTED: 'mdc-list-item--selected',
  LIST: 'mdc-list',
  LIST_ITEM: 'mdc-list-item',
  LIST_OPEN: `${ROOT}__list--open`,
  OPEN: `${ROOT}--open`,
  SELECTED_OPTION: `${ROOT}__option`,
  UPGRADED: `${ROOT}--upgraded`
};

/** @enum {string} */
const strings = {
  BOTTOM_LINE_SELECTOR: `.${ROOT}__bottom-line`,
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
  AUTOCORRECT: 'autocorrect',
  CHANGE_EVENT: 'MDCExtMultiselect:change',
  ITEM_DATA_DESC_ATTR: 'data-description',
  ITEM_DATA_RAWDATA_ATTR: 'data-rawdata',
  ITEM_DATA_VALUE_ATTR: 'data-value',
  ROLE: 'role',
  SELECTED_ATTR: 'selected',
  SPELLCHECK: 'spellcheck'
};

/** @enum {number} */
const numbers = {
  OPENING_END_LATCH_MS: 500,
  // Amount of miliseconds to wait before triggering a change value functionality.
  CHANGE_VALUE_TRIGGER_DELAY: 500,
  LABEL_SCALE: 0.75
}

export {cssClasses, strings, numbers};
