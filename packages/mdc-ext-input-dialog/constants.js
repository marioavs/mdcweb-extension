/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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
const ROOT = 'mdc-ext-input-dialog';

/** @enum {string} */
const cssClasses = {
  ROOT: ROOT,
  OPEN: `${ROOT}--open`,
  ANCHOR: `${ROOT}-anchor`,
  ANIMATING: `${ROOT}--animating`,
  BACKDROP: `${ROOT}__backdrop`,
  SCROLL_LOCK: `${ROOT}-scroll-lock`,
  ACCEPT_BTN: `${ROOT}__button--accept`,
  CANCEL_BTN: `${ROOT}__button--cancel`,
};

/** @enum {string} */
const strings = {
  ACCEPT_SELECTOR: `.${ROOT}__button--accept`,
  BUTTONS_SELECTOR: `.${ROOT}__button`,
  DIALOG_SURFACE_SELECTOR: `.${ROOT}__surface`,
  OPEN_DIALOG_SELECTOR: `.${ROOT}--open`,
  ACCEPT_EVENT: 'MDCExtInputDialog:accept',
  CANCEL_EVENT: 'MDCExtInputDialog:cancel',
};

/** @enum {number} */
const numbers = {
  // Margin left to the edge of the viewport when menu is at maximum possible height.
  MARGIN_TO_EDGE: 32,
};

/**
 * Enum for bits in the {@see Corner) bitmap.
 * @enum {number}
 */
const CornerBit = {
  BOTTOM: 1,
  CENTER: 2,
  RIGHT: 4,
  FLIP_RTL: 8,
  FIXED_CENTER: 16,
};

/**
 * Enum for representing an element corner for positioning the menu.
 *
 * The START constants map to LEFT if element directionality is left
 * to right and RIGHT if the directionality is right to left.
 * Likewise END maps to RIGHT or LEFT depending on the directionality.
 *
 * @enum {number}
 */
const Corner = {
  TOP_LEFT: 0,
  TOP_RIGHT: CornerBit.RIGHT,
  BOTTOM_LEFT: CornerBit.BOTTOM,
  BOTTOM_RIGHT: CornerBit.BOTTOM | CornerBit.RIGHT,
  TOP_START: CornerBit.FLIP_RTL,
  TOP_END: CornerBit.FLIP_RTL | CornerBit.RIGHT,
  BOTTOM_START: CornerBit.BOTTOM | CornerBit.FLIP_RTL,
  BOTTOM_END: CornerBit.BOTTOM | CornerBit.RIGHT | CornerBit.FLIP_RTL,
  FIXED_CENTER: CornerBit.FIXED_CENTER,
};

export {cssClasses, strings, numbers, CornerBit, Corner};
