/**
 * @license
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

/* eslint-disable no-unused-vars */
import MDCExtDatePickerLabelFoundation from './label/foundation';

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * @typedef {{
 *   value: string,
 *   disabled: boolean,
 *   readOnly: boolean,
 *   validity: {
 *     badInput: boolean,
 *     valid: boolean,
 *   },
 * }}
 */
let NativeInputType;

/**
 * @typedef {{
 *   label: (!MDCExtDatePickerLabelFoundation|undefined)
 * }}
 */
let FoundationMapType;

/**
 * Adapter for MDC Text Field.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Text Field into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCExtDatePickerAdapter {
  /**
   * Adds a class to the root element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the root element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Adds a class to the previous button element.
   * @param {string} className
   */
  addPrevClass(className) {}

  /**
   * Removes a class from the previous button element.
   * @param {string} className
   */
  removePrevClass(className) {}

  /**
   * Adds a class to the next button element.
   * @param {string} className
   */
  addNextClass(className) {}

  /**
   * Removes a class from the next button element.
   * @param {string} className
   */
  removeNextClass(className) {}

  addDayClassAndFocus(date, className, focus) {}

  removeAllDaysClass(className) {}

  addYearClass(year, className) {}

  removeYearClass(year, className) {}

  addYearListClass(className) {}

  removeYearListClass(className) {}

  /**
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /** @return {boolean} */
  hasNecessaryDom() {}

  /** @return {boolean} */
  eventTargetInDatePicker(target) {}

  /** @return {boolean} */
  eventTargetInSurface(target) {}

  /** @return {boolean} */
  eventTargetHasClass(target, className) {}

  /** @return {!Object} */
  eventTargetDateAttr(target) {}

  /**
   * @return {{bottom: number, height: number, left: number, right: number, top: number, width: number}}
   */
  getDayTableDimensions() {}

  /**
   * Registers an event handler on the root element for a given event.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  registerDatePickerInteractionHandler(type, handler) {}

  /**
   * Deregisters an event handler on the root element for a given event.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  deregisterDatePickerInteractionHandler(type, handler) {}

  registerTransitionEndHandler(handler) {}

  deregisterTransitionEndHandler(handler) {}

  /**
   * Registers an event handler on document for key down event.
   * @param {!Function} handler
   */
  registerDocumentKeydownHandler(handler) {}

  /**
   * Un-registers an event handler on document for key down event.
   * @param {!Function} handler
   */
  deregisterDocumentKeydownHandler(handler) {}

  registerSurfaceInteractionHandler(type, handler) {}

  deregisterSurfaceInteractionHandler(type, handler) {}

  registerDocumentInteractionHandler(evtType, handler) {}

  deregisterDocumentInteractionHandler(evtType, handler) {}

  registerDayClickHandler(handler) {}

  deregisterDayClickHandler(handler) {}

  registerTableTransitionEndHandler(handler) {}

  deregisterTableTransitionEndHandler(handler) {}

  registerYearTransitionEndHandler(handler) {}

  deregisterYearTransitionEndHandler(handler) {}

  setYearListStyleProperty(propertyName, value) {}

  setupDayTables() {}

  replaceTableBody() {}

  replaceTableClass() {}

  setDateContent() {}

  setMonthContent() {}

  setMonthFocus() {}

  setWeekDayContent() {}

  setYearContent() {}

  setupYearList(size, minYear, maxYear) {}

  setFirstYear(year) {}

  getYearListOffsetHeight() {}

  getYearOffsetHeight(i) {}

  getYearSelectionClientHeight() {}

  /** @return {number} */
  getTabIndex() {}

  /** @param {number} tabIndex */
  setTabIndex(tabIndex) {}

  /**
   * @param {string} name
   * @return {string}
   */
  getAttr(name) {}

  /**
   * @param {string} name
   * @param {string} value
   */
  setAttr(name, value) {}

  /** @param {string} name */
  rmAttr(name) {}

  setMonthsHeight(height) {}

  setMonthsWidth(width) {}

  /**
   * @return {?Element}
   */
  getPrevNativeControl() {}

  /**
   * @return {?Element}
   */
  getNextNativeControl() {}

  /**
   * @param {string} name
   * @param {string} value
   */
  setPrevAttr(name, value) {}

  /** @param {string} name */
  rmPrevAttr(name) {}

  /**
   * @param {string} name
   * @param {string} value
   */
  setNextAttr(name, value) {}

  /** @param {string} name */
  rmNextAttr(name) {}

  /**
   * Returns true if the textfield is focused.
   * We achieve this via `document.activeElement === this.root_`.
   * @return {boolean}
   */
  isFocused() {}

  /**
   * Returns true if the direction of the root element is set to RTL.
   * @return {boolean}
   */
  isRtl() {}

  notifyAccept() {}

  notifyCancel() {}

  /** @param {{type: string}} evtData */
  notifyChange(evtData) {}

  trapFocusOnSurface() {}

  untrapFocusOnSurface() {}

  /**
   * Registers an event listener on the native input element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  registerInputInteractionHandler(evtType, handler) {}

  /**
   * Deregisters an event listener on the native input element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  deregisterInputInteractionHandler(evtType, handler) {}

  /**
   * Returns an object representing the native text input element, with a
   * similar API shape. The object returned should include the value, disabled
   * and badInput properties, as well as the checkValidity() function. We never
   * alter the value within our code, however we do update the disabled
   * property, so if you choose to duck-type the return value for this method
   * in your implementation it's important to keep this in mind. Also note that
   * this method can return null, which the foundation will handle gracefully.
   * @return {?Element|?NativeInputType}
   */
  getNativeInput() {}
}

export {MDCExtDatePickerAdapter, NativeInputType, FoundationMapType};
