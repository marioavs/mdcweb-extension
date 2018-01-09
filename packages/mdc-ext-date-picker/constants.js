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
  ACCEPT_BTN: `${ROOT}__button--accept`,
  ANIMATING: `${ROOT}--animating`,
  BUTTON: `${ROOT}__button`,
  BUTTON_DISABLED: `${ROOT}__button--disabled`,
  BUTTON_YEAR: `${ROOT}__button--year`,
  CALENDAR_DAY: `${ROOT}__day`,
  CALENDAR_YEAR: `${ROOT}__year`,
  CANCEL_BTN: `${ROOT}__button--cancel`,
  DAY_SELECTED: `${ROOT}__day--selected`,
  DAY_TABLE_ACTIVE: `${ROOT}__days--active`,
  DAY_TABLE_ANIMATING: `${ROOT}__days--animating`,
  DAY_TABLE_HIDDEN: `${ROOT}__days--hidden`,
  DAY_TABLE_NEXT: `${ROOT}__days--next`,
  DAY_TABLE_PREV: `${ROOT}__days--prev`,
  DISABLED: `${ROOT}--disabled`,
  FOCUSED: `${ROOT}--focused`,
  INVALID: `${ROOT}--invalid`,
  NEXT_BTN: `${ROOT}__next`,
  OPEN: `${ROOT}--open`,
  PREV_BTN: `${ROOT}__prev`,
  SURFACE: `${ROOT}__surface`,
  UPGRADED: `${ROOT}--upgraded`,
  YEAR_LIST_ANIMATING: `${ROOT}__year-list--animating`,
  YEAR_SELECTED: `${ROOT}__year--selected`,
  YEAR_VIEW: `${ROOT}--year-view`
};

/** @enum {string} */
const strings = {
  ACCEPT_SELECTOR: `.${ROOT}__button--accept`,
  BUTTON_YEAR_SELECTOR: `.${ROOT}__button--year`,
  CALENDAR_DAY_SELECTOR: `.${ROOT}__day`,
  CANCEL_SELECTOR: `.${ROOT}__button--cancel`,
  DAY_ROWS_SELECTOR: `.${ROOT}__days tbody tr`,
  DAY_TABLE_SELECTOR: `.${ROOT}__days`,
  DAY_TABLE_ACTIVE_SELECTOR: `.${ROOT}__days--active`,
  DAY_TABLE_HIDDEN_SELECTOR: `.${ROOT}__days--hidden`,
  DAY_TABLE_NEXT_SELECTOR: `.${ROOT}__days--next`,
  DAY_TABLE_PREV_SELECTOR: `.${ROOT}__days--prev`,
  INPUT_SELECTOR: `.${ROOT}__input`,
  LABEL_SELECTOR: `.${ROOT}__label`,
  MONTHS_SELECTOR: `.${ROOT}__months`,
  NEXT_SELECTOR: `.${ROOT}__next`,
  PREV_SELECTOR: `.${ROOT}__prev`,
  SURFACE_SELECTOR: `.${ROOT}__surface`,
  TXT_DATE_SELECTOR: `.${ROOT}__txtdate`,
  TXT_MONTH_SELECTOR: `.${ROOT}__txtmonth`,
  TXT_WEEK_DAY_SELECTOR: `.${ROOT}__txtweekday`,
  YEAR_LIST_SELECTOR: `.${ROOT}__year-list`,
  YEAR_SELECTION_SELECTOR: `.${ROOT}__year-selection`,
  YEAR_SELECTOR: `.${ROOT}__year`,
  ARIA_DISABLED: 'aria-disabled',
  ACCEPT_EVENT: 'MDCExtDatePicker:accept',
  CANCEL_EVENT: 'MDCExtDatePicker:cancel',
  CHANGE_EVENT: 'MDCExtDatePicker:change',
  DATA_DATE: 'data-date',
  DATA_MONTH: 'data-month',
  DATA_YEAR: 'data-year',
  TYPE_ACTIVE: 'active',
  TYPE_HIDDEN: 'hidden',
  TYPE_NEXT: 'next',
  TYPE_PREV: 'previous'
};

export {cssClasses, strings};
