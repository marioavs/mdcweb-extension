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
const ROOT = 'mdc-ext-pagination';

/** @enum {string} */
export const cssClasses = {
  ROOT: ROOT,
  BUTTON_DISABLED: `${ROOT}__button--disabled`,
  DISABLED: `${ROOT}--disabled`,
  UPGRADED: `${ROOT}--upgraded`
};

/** @enum {string} */
export const strings = {
  FIRST_SELECTOR: `.${ROOT}__txtfirst`,
  LAST_SELECTOR: `.${ROOT}__txtlast`,
  NEXT_SELECTOR: `.${ROOT}__next`,
  PREV_SELECTOR: `.${ROOT}__prev`,
  TOTAL_SELECTOR: `.${ROOT}__txttotal`,
  ARIA_DISABLED: 'aria-disabled',
  CHANGE_EVENT: 'MDCExtPagination:change',
  DATA_PAGE_SIZE: 'data-page-size',
  TYPE_NEXT: 'next',
  TYPE_PREV: 'previous'
};
