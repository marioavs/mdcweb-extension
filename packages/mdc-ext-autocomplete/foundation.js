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

import {MDCFoundation} from '@material/base';
import {cssClasses, strings} from './constants';
import {MDCSimpleMenuFoundation} from '@material/menu';

const OPENER_KEYS = [
  {key: 'ArrowUp', keyCode: 38, forType: 'keydown'},
  {key: 'ArrowDown', keyCode: 40, forType: 'keydown'},
  {key: 'Space', keyCode: 32, forType: 'keyup'},
];

export default class MDCExtAutocompleteFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      setAttr: (/* attr: string, value: string */) => {},
      rmAttr: (/* attr: string */) => {},
      computeBoundingRect: () => /* {left: number, top: number} */ ({left: 0, top: 0}),
      registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
      focus: () => {},
      makeTabbable: () => {},
      makeUntabbable: () => {},
      getComputedStyleValue: (/* propertyName: string */) => /* string */ '',
      setStyle: (/* propertyName: string, value: string */) => {},
      create2dRenderingContext: () => /* {font: string, measureText: (string) => {width: number}} */ ({
        font: '',
        measureText: () => ({width: 0}),
      }),
      setMenuElStyle: (/* propertyName: string, value: string */) => {},
      setMenuElAttr: (/* attr: string, value: string */) => {},
      rmMenuElAttr: (/* attr: string */) => {},
      getMenuElOffsetHeight: () => /* number */ 0,
      openMenu: (/* focusIndex: number */) => {},
      isMenuOpen: () => /* boolean */ false,
      setSelectedTextContent: (/* textContent: string */) => {},
      getNumberOfItems: () => /* number */ 0,
      getTextForItemAtIndex: (/* index: number */) => /* string */ '',
      getValueForItemAtIndex: (/* index: number */) => /* string */ '',
      setAttrForItemAtIndex: (/* index: number, attr: string, value: string */) => {},
      rmAttrForItemAtIndex: (/* index: number, attr: string */) => {},
      getOffsetTopForItemAtIndex: (/* index: number */) => /* number */ 0,
      registerMenuInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterMenuInteractionHandler: (/* type: string, handler: EventListener */) => {},
      notifyChange: () => {},
      getWindowInnerHeight: () => /* number */ 0,
      getNativeInput: () => /* HTMLInputElement */ ({})
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCExtAutocompleteFoundation.defaultAdapter, adapter));
    this.ctx_ = null;
    this.items_ = [];
    this.selectedIndex_ = -1;
    this.disabled_ = false;
    this.lastValue_ = '';
    this.displayHandler_ = (evt) => {
      evt.preventDefault();
      if (!this.adapter_.isMenuOpen()) {
        this.open_();
      }
    };
    this.displayViaKeyboardHandler_ = (evt) => this.handleDisplayViaKeyboard_(evt);
    this.selectionHandler_ = ({detail}) => {
      const {index} = detail;
      this.close_();
      if (index !== this.selectedIndex_) {
        this.setSelectedIndex(index);
        this.adapter_.notifyChange();
      }
    };
    this.cancelHandler_ = () => {
      this.close_();
    };
  }

  init() {
    this.ctx_ = this.adapter_.create2dRenderingContext();
    this.adapter_.registerInteractionHandler('click', this.displayHandler_);
    this.adapter_.registerInteractionHandler('keydown', this.displayViaKeyboardHandler_);
    this.adapter_.registerInteractionHandler('keyup', this.displayViaKeyboardHandler_);
    // this.adapter_.registerInputInteractionHandler('keyup', this.handleInputKeyboardEvent_);
    this.adapter_.registerMenuInteractionHandler(
      MDCSimpleMenuFoundation.strings.SELECTED_EVENT, this.selectionHandler_);
    this.adapter_.registerMenuInteractionHandler(
      MDCSimpleMenuFoundation.strings.CANCEL_EVENT, this.cancelHandler_);
    this.resize();
  }

  destroy() {
    // Drop reference to context object to prevent potential leaks
    this.ctx_ = null;
    this.adapter_.deregisterInteractionHandler('click', this.displayHandler_);
    this.adapter_.deregisterInteractionHandler('keydown', this.displayViaKeyboardHandler_);
    this.adapter_.deregisterInteractionHandler('keyup', this.displayViaKeyboardHandler_);
    // this.adapter_.deregisterInputInteractionHandler('keyup', this.handleInputKeyboardEvent_);
    this.adapter_.deregisterMenuInteractionHandler(
      MDCSimpleMenuFoundation.strings.SELECTED_EVENT, this.selectionHandler_);
    this.adapter_.deregisterMenuInteractionHandler(
      MDCSimpleMenuFoundation.strings.CANCEL_EVENT, this.cancelHandler_);
  }

  // /** @return {?string} */
  // getInputValue() {
  //   return this.getNativeInput_().value;
  // }

  /** @param {?string} value */
  setInputValue(value) {
    this.getNativeInput_().value = value;
  }

  getValue() {
    return this.selectedIndex_ >= 0 ? this.adapter_.getValueForItemAtIndex(this.selectedIndex_) : '';
  }

  getSelectedIndex() {
    return this.selectedIndex_;
  }

  setSelectedIndex(index) {
    const prevSelectedIndex = this.selectedIndex_;
    if (prevSelectedIndex >= 0) {
      this.adapter_.rmAttrForItemAtIndex(this.selectedIndex_, 'aria-selected');
    }

    this.selectedIndex_ = index >= 0 && index < this.adapter_.getNumberOfItems() ? index : -1;
    let selectedTextContent = '';
    if (this.selectedIndex_ >= 0) {
      selectedTextContent = this.adapter_.getTextForItemAtIndex(this.selectedIndex_).trim();
      this.adapter_.setAttrForItemAtIndex(this.selectedIndex_, 'aria-selected', 'true');
    }
    this.adapter_.setSelectedTextContent(selectedTextContent);
  }

  isDisabled() {
    return this.disabled_;
  }

  setDisabled(disabled) {
    const {DISABLED} = MDCExtAutocompleteFoundation.cssClasses;
    this.disabled_ = disabled;
    if (this.disabled_) {
      this.adapter_.addClass(DISABLED);
      this.adapter_.setAttr('aria-disabled', 'true');
      this.adapter_.makeUntabbable();
    } else {
      this.adapter_.removeClass(DISABLED);
      this.adapter_.rmAttr('aria-disabled');
      this.adapter_.makeTabbable();
    }
  }

  addItem(option){
    if (this.items_ === undefined)
      return;
  }

  resize() {
    const font = this.adapter_.getComputedStyleValue('font');
    const letterSpacing = parseFloat(this.adapter_.getComputedStyleValue('letter-spacing'));
    if (font) {
      this.ctx_.font = font;
    } else {
      const primaryFontFamily = this.adapter_.getComputedStyleValue('font-family').split(',')[0];
      const fontSize = this.adapter_.getComputedStyleValue('font-size');
      this.ctx_.font = `${fontSize} ${primaryFontFamily}`;
    }

    let maxTextLength = 0;
    for (let i = 0, l = this.adapter_.getNumberOfItems(); i < l; i++) {
      const txt = this.adapter_.getTextForItemAtIndex(i).trim();
      const {width} = this.ctx_.measureText(txt);
      const addedSpace = letterSpacing * txt.length;
      maxTextLength = Math.max(maxTextLength, Math.ceil(width + addedSpace));
    }
    this.adapter_.setStyle('width', `${maxTextLength}px`);
  }

  open_() {
    const {OPEN} = MDCExtAutocompleteFoundation.cssClasses;
    const focusIndex = this.selectedIndex_ < 0 ? 0 : this.selectedIndex_;
    // const {left, top, transformOrigin} = this.computeMenuStylesForOpenAtIndex_(focusIndex);
    const {left, top, transformOrigin} = this.computeMenuStylesForOpen_();

    this.adapter_.setMenuElStyle('left', left);
    this.adapter_.setMenuElStyle('top', top);
    this.adapter_.setMenuElStyle('transform-origin', transformOrigin);
    this.adapter_.addClass(OPEN);
    this.adapter_.openMenu(focusIndex);
  }

  computeMenuStylesForOpen_() {
    const {left, top} = this.adapter_.computeBoundingRect();

    let adjustedTop = top + this.adapter_.getNativeOffsetHeight();
    return {
      left: left,
      top: adjustedTop
    }
  }

  computeMenuStylesForOpenAtIndex_(index) {
    const innerHeight = this.adapter_.getWindowInnerHeight();
    const {left, top} = this.adapter_.computeBoundingRect();

    this.adapter_.setMenuElAttr('aria-hidden', 'true');
    this.adapter_.setMenuElStyle('display', 'block');
    const menuHeight = this.adapter_.getMenuElOffsetHeight();
    const itemOffsetTop = this.adapter_.getOffsetTopForItemAtIndex(index);
    this.adapter_.setMenuElStyle('display', '');
    this.adapter_.rmMenuElAttr('aria-hidden');

    let adjustedTop = top + itemOffsetTop;
    const adjustedHeight = menuHeight - itemOffsetTop;
    const overflowsTop = adjustedTop < 0;
    const overflowsBottom = adjustedTop + adjustedHeight > innerHeight;
    if (overflowsTop) {
      adjustedTop = 0;
    } else if (overflowsBottom) {
      adjustedTop = Math.max(0, adjustedTop - adjustedHeight);
    }

    return {
      left: `${left}px`,
      top: `${adjustedTop}px`,
      transformOrigin: `center ${itemOffsetTop}px`,
    };
  }

  close_() {
    const {OPEN} = MDCExtAutocompleteFoundation.cssClasses;
    this.adapter_.removeClass(OPEN);
    this.adapter_.focus();
  }

  applyQuery_(value) {
    const {ARIA_HIDDEN} = MDCExtAutocompleteFoundation.strings;
    const {ITEM_NOMATCH} = MDCExtAutocompleteFoundation.cssClasses;
    for (let i = 0, l = this.adapter_.getNumberOfItems(); i < l; i++) {
      const txt = this.adapter_.getTextForItemAtIndex(i).trim();
      if (txt.toUpperCase().includes(value.toUpperCase())) {
        this.adapter_.rmClassForItemAtIndex(i, ITEM_NOMATCH);
        this.adapter_.rmAttrForItemAtIndex(i, ARIA_HIDDEN);
      }
      else {
        this.adapter_.addClassForItemAtIndex(i, ITEM_NOMATCH);
        this.adapter_.setAttrForItemAtIndex(i, ARIA_HIDDEN, 'true');
      }
    }
  }

  // handleInputKeyboardEvent_(evt) {
  //   let curretValue = this.getNativeInput_().value;
  //   if (currentValue !== this.lastValue_) {
  //     this.applyQuery_(currentValue);
  //   }
  //   console.log(currentValue);
  // }

  handleDisplayViaKeyboard_(evt) {
    let currentValue = this.getNativeInput_().value;
    if (currentValue !== this.lastValue_) {
      this.applyQuery_(currentValue);
      this.lastValue_ = currentValue;
    }

    // We use a hard-coded 2 instead of Event.AT_TARGET to avoid having to reference a browser
    // global.
    const EVENT_PHASE_AT_TARGET = 2;
    if (evt.eventPhase !== EVENT_PHASE_AT_TARGET) {
      return;
    }

    // Prevent pressing space down from scrolling the page
    const isSpaceDown = evt.type === 'keydown' && (evt.key === 'Space' || evt.keyCode === 32);
    if (isSpaceDown) {
      evt.preventDefault();
    }

    const isOpenerKey = OPENER_KEYS.some(({key, keyCode, forType}) => {
      return evt.type === forType && (evt.key === key || evt.keyCode === keyCode);
    });
    if (isOpenerKey) {
      this.displayHandler_(evt);
    }

  }

  /**
   * @return {!InputElementState}
   * @private
   */
  getNativeInput_() {
    return this.adapter_.getNativeInput() || {
      checked: false,
      indeterminate: false,
      disabled: false,
      value: null,
    };
  }
}
