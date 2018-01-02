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
const ROOT = 'mdc-ext-date-picker';

/** @enum {string} */
const cssClasses = {
  ROOT: ROOT,
  ANIMATING: `${ROOT}--animating`,
  BUTTON_DISABLED: `${ROOT}__button--disabled`,
  DISABLED: `${ROOT}--disabled`,
  FOCUSED: `${ROOT}--focused`,
  INVALID: `${ROOT}--invalid`,
  OPEN: `${ROOT}--open`,
  SURFACE: `${ROOT}__surface`,
  UPGRADED: `${ROOT}--upgraded`
};

/** @enum {string} */
const strings = {
  ACCEPT_SELECTOR: `.${ROOT}__button--accept`,
  CANCEL_SELECTOR: `.${ROOT}__button--cancel`,
  INPUT_SELECTOR: `.${ROOT}__input`,
  LABEL_SELECTOR: `.${ROOT}__label`,
  NEXT_SELECTOR: `.${ROOT}__next`,
  PREV_SELECTOR: `.${ROOT}__prev`,
  SURFACE_SELECTOR: `.${ROOT}__surface`,
  ARIA_DISABLED: 'aria-disabled',
  ACCEPT_EVENT: 'MDCExtDatePicker:accept',
  CANCEL_EVENT: 'MDCExtDatePicker:cancel',
  CHANGE_EVENT: 'MDCExtDatePicker:change',
  TYPE_NEXT: 'next',
  TYPE_PREV: 'previous'
};

export {cssClasses, strings};
