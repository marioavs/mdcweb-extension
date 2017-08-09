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
import {cssClasses, strings, numbers} from './constants';

const OPENER_KEYS = [
  {key: 'ArrowUp', keyCode: 38, forType: 'keydown'},
  {key: 'ArrowDown', keyCode: 40, forType: 'keydown'}
];

export default class MDCExtMultiselectFoundation extends MDCFoundation {
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
      addClassToLabel: (/* className: string */) => {},
      removeClassFromLabel: (/* className: string */) => {},
      addClassToHelptext: (/* className: string */) => {},
      removeClassFromHelptext: (/* className: string */) => {},
      helptextHasClass: (/* className: string */) => {},
      setHelptextAttr: (/* attr: string, value: string */) => {},
      removeHelptextAttr: (/* attr: string */) => {},
      addClassToList: (/* className: string */) => {},
      removeClassFromList: (/* className: string */) => {},
      setAttr: (/* attr: string, value: string */) => {},
      removeAttr: (/* attr: string */) => {},
      setInputAttr: (/* attr: string, value: string */) => {},
      removeInputAttr: (/* attr: string */) => {},
      hasClass: () => /* boolean */ false,
      hasNecessaryDom: () => /* boolean */ false,
      getComboboxElOffsetHeight: () => /* number */ 0,
      getComboboxElOffsetTop: () => /* number */ 0,
      registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
      registerInputInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInputInteractionHandler: (/* type: string, handler: EventListener */) => {},
      registerListInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterListInteractionHandler: (/* type: string, handler: EventListener */) => {},
      focus: () => {},
      isFocused: () => {},
      hasItemsLoader: () => /* boolean */ false,
      applyItemsLoader: (/* query: string */) => {},
      addItem: (/* data: Object */) => {},
      removeItems: () => {},
      addSelectedOption: (/* value: string, description: string */) => {},
      removeSelectedOption: (/* index: number */) => {},
      setListElStyle: (/* propertyName: string, value: string */) => {},
      getNumberOfSelectedOptions: () => /* number */ 0,
      getNumberOfItems: () => /* number */ 0,
      getNumberOfAvailableItems: () => /* number */ 0,
      getSelectedOptions: () => /* HTMLElement */ {},
      getActiveItem: () => /* HTMLElement */ {},
      getActiveItemDescription: () => /* string */ '',
      getActiveItemIndex: () => /* number */ 0,
      getActiveItemValue: () => /* string */ '',
      setActiveItem: (/* item: HTMLElement */) => {},
      setActiveForItemAtIndex: (/* index: number */) => {},
      removeActiveItem: () => {},
      isActiveItemAvailable: () => /* boolean */ false,
      getTextForItemAtIndex: (/* index: number */) => /* string */ '',
      getValueForItemAtIndex: (/* index: number */) => /* string */ '',
      addClassForItemAtIndex: (/* index: number, className: string */) => {},
      rmClassForItemAtIndex: (/* index: number, className: string */) => {},
      setAttrForItemAtIndex: (/* index: number, attr: string, value: string */) => {},
      rmAttrForItemAtIndex: (/* index: number, attr: string */) => {},
      notifyChange: () => {},
      getNativeElement: () => /* HTMLElement */ {},
      getNativeInput: () => /* HTMLInputElement */ {}
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCExtMultiselectFoundation.defaultAdapter, adapter));
    this.disabled_ = false;
    this.maxSelectedItems_ = 1;
    this.valueProperty_ = 'value';
    this.descriptionProperty_ = 'description';
    this.lastInputValue_ = undefined;
    this.cachedNumberOfAvailableItems_ = 0;
    this.cachedActiveItem_ = undefined;
    this.focusHandler_ = () => this.activateFocus_();
    this.blurHandler_ = () => this.deactivateFocus_();
    this.clickHandler_ = (evt) => this.adapter_.focus();
    this.listClickHandler_ = (evt) => this.handleListClick_(evt);
    this.listMousedownHandler_ = (evt) => /* avoid component blur event */ evt.preventDefault();
    this.inputKeydownHandler_ = (evt) => this.handleKeydown_(evt);
    /** @private {function(!Event)} */
    this.inputInputHandler_ = (evt) => this.handleInputInput_(evt);
    /** @private {boolean} */
    this.isOpen_ = false;
    /** @private {number} */
    this.changeValueTriggerTimerId_ = 0;
  }

  init() {
    const {ROOT, UPGRADED} = cssClasses;
    const {AUTOCOMPLETE} = strings;

    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (!this.adapter_.hasNecessaryDom()) {
      throw new Error(`Required DOM nodes missing in ${ROOT} component.`);
    }

    this.adapter_.addClass(UPGRADED);
    this.adapter_.setInputAttr(AUTOCOMPLETE, 'off');
    this.adapter_.registerInteractionHandler('click', this.clickHandler_);
    this.adapter_.registerInputInteractionHandler('focus',this.focusHandler_);
    this.adapter_.registerInputInteractionHandler('blur',this.blurHandler_);
    this.adapter_.registerInputInteractionHandler('keydown', this.inputKeydownHandler_);
    this.adapter_.registerInputInteractionHandler('input', this.inputInputHandler_);
    this.adapter_.registerListInteractionHandler('mousedown', this.listMousedownHandler_);
    this.adapter_.registerListInteractionHandler('click', this.listClickHandler_);
    this.resize();
  }

  destroy() {
    const {UPGRADED} = cssClasses;

    clearTimeout(this.changeValueTriggerTimerId_);
    this.adapter_.removeClass(UPGRADED);
    this.adapter_.deregisterInteractionHandler('click', this.displayHandler_);
    this.adapter_.deregisterInputInteractionHandler('focus',this.focusHandler_);
    this.adapter_.deregisterInputInteractionHandler('blur',this.blurHandler_);
    this.adapter_.deregisterInputInteractionHandler('keydown', this.keydownHandler_);
    this.adapter_.deregisterInputInteractionHandler('input', this.inputInputHandler_);
    this.adapter_.deregisterListInteractionHandler('mousedown', this.listMousedownHandler_);
    this.adapter_.deregisterListInteractionHandler('click', this.listClickHandler_);
  }

  /** @return {?string} */
  getValue() {
    return this.getNativeElement_().value;
  }

  /** @param {?string} value */
  setValue(value) {
    this.getNativeElement_().value = value;
  }

  /** @param {?string} value */
  setInputValue(value) {
    this.getNativeInput_().value = value;
  }

  isDisabled() {
    return this.disabled_;
  }

  setDisabled(disabled) {
    const {DISABLED} = cssClasses;
    const {ARIA_DISABLED} = strings;
    this.disabled_ = disabled;
    if (this.disabled_) {
      this.adapter_.addClass(DISABLED);
      this.adapter_.setAttr(ARIA_DISABLED, 'true');
    } else {
      this.adapter_.removeClass(DISABLED);
      this.adapter_.removeAttr(ARIA_DISABLED);
    }
  }

  getNumberOfSelectedOptions() {
    return this.adapter_.getNumberOfSelectedOptions();
  }

  /** @return {boolean} */
  isOpen() {
    return this.isOpen_;
  }

  addItems(items) {
    if (!Array.isArray(items))
      return;
    for (let i = 0, l = items.length; i < l; i++) {
      this.adapter_.addItem(items[i]);
    }
  }

  removeItems() {
    this.adapter_.removeItems();
  }

  setValueProperty(value) {
    this.valueProperty_ = value;
  }

  getValueProperty() {
    return this.valueProperty_;
  }

  setDescriptionProperty(value) {
    this.descriptionProperty_ = value;
  }

  getDescriptionProperty() {
    return this.descriptionProperty_;
  }

  refreshItems() {
    this.cachedNumberOfAvailableItems_ = this.adapter_.getNumberOfAvailableItems();
    if (!this.adapter_.isActiveItemAvailable()) {
      this.adapter_.removeActiveItem();
      if (this.cachedNumberOfAvailableItems_ > 0) {
        this.cachedActiveItem_ = 0;
        this.adapter_.setActiveForItemAtIndex(this.cachedActiveItem_);
      } else {
        this.cachedActiveItem_ = undefined;
      }
    }
    if (!this.isOpen() && (this.adapter_.isFocused())) {
      this.open_();
    }
  }

  resize() {
  }

  activateFocus_() {
    const {FOCUSED, LABEL_FLOAT_ABOVE} = cssClasses;

    this.adapter_.addClass(FOCUSED);
    this.adapter_.addClassToLabel(LABEL_FLOAT_ABOVE);
    this.updateInputStatus_();
    this.showHelptext_();
    if (!this.isOpen()) {
      this.cachedNumberOfAvailableItems_ = this.adapter_.getNumberOfAvailableItems();
      if ((this.cachedActiveItem_ === undefined) && (this.cachedNumberOfAvailableItems_ > 0)) {
        this.adapter_.removeActiveItem();
        this.cachedActiveItem_ = 0;
        this.adapter_.setActiveForItemAtIndex(this.cachedActiveItem_);
      }
      if (this.cachedNumberOfAvailableItems_ == 0)
        this.updateAvailableItems_();
      else
        this.open_();
    }
  }

  deactivateFocus_() {
    const {FOCUSED, INVALID, LABEL_FLOAT_ABOVE} = cssClasses;
    const input = this.getNativeInput_();
    const isValid = input.checkValidity();

    this.adapter_.removeClass(FOCUSED);
    if (this.getNumberOfSelectedOptions() <= 0) {
      this.adapter_.removeClassFromLabel(LABEL_FLOAT_ABOVE);
    }
    if (isValid) {
      this.adapter_.removeClass(INVALID);
    } else {
      this.adapter_.addClass(INVALID);
    }
    this.updateHelptextOnDeactivation_(isValid);
    this.clearInput_();
    this.close_();
  }

  handleKeydown_(evt) {
    // We use a hard-coded 2 instead of Event.AT_TARGET to avoid having to reference a browser
    // global.
    const EVENT_PHASE_AT_TARGET = 2;
    if (evt.eventPhase !== EVENT_PHASE_AT_TARGET) {
      return;
    }

    // Do nothing if Alt, Ctrl or Meta are pressed.
    if (evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey) {
      return;
    }

    let tryOpen = false;
    const {keyCode, key, shiftKey} = evt;
    const isBackspace = key === 'Backspace' || keyCode === 8;
    const isTab = key === 'Tab' || keyCode === 9;
    const isEnter = key === 'Enter' || keyCode === 13;
    const isEscape = key === 'Escape' || keyCode === 27;
    const isArrowUp = key === 'ArrowUp' || keyCode === 38;
    const isArrowDown = key === 'ArrowDown' || keyCode === 40;

    if (isArrowUp) {
      tryOpen = true;
      evt.preventDefault();
      if ((this.cachedActiveItem_ !== undefined) && (this.cachedActiveItem_ > 0)) {
        this.adapter_.removeActiveItem();
        this.cachedActiveItem_--;
        this.adapter_.setActiveForItemAtIndex(this.cachedActiveItem_);
      }
    } else if (isArrowDown) {
      tryOpen = true;
      evt.preventDefault();
      if ((this.cachedActiveItem_ !== undefined) && (this.cachedActiveItem_ < (this.cachedNumberOfAvailableItems_ - 1))) {
        this.adapter_.removeActiveItem();
        this.cachedActiveItem_++;
        this.adapter_.setActiveForItemAtIndex(this.cachedActiveItem_);
      }
    } else if ((isBackspace) && (this.adapter_.getNativeInput().selectionStart == 0)) {
      if (this.adapter_.getNumberOfSelectedOptions() > 0) {
        this.adapter_.removeSelectedOption(this.adapter_.getNumberOfSelectedOptions() - 1);
        this.updateInputStatus_();
      }
    } else if (this.isOpen() && (isTab) || (isEnter)) {
      let currentItem = this.adapter_.getActiveItem();
      if (currentItem != null) {
        evt.preventDefault();
        this.applyValueFromActiveItem_();
      }
    } else if (this.isOpen() && (isEscape)) {
      this.close_();
    }

    if ((tryOpen) && (!this.isOpen()))
      this.open_();
  }

  handleInputInput_(evt = null) {
    let currentValue = evt ? evt.target.value : this.getNativeInput_().value;
    if (currentValue !== this.lastInputValue_) {
      this.lastInputValue_ = currentValue;
      this.updateAvailableItems_();
    }
  }

  handleListClick_(evt) {
    const {LIST_ITEM} = cssClasses;
    if ((evt.target) && (evt.target.classList.contains(LIST_ITEM))) {
      evt.stopPropagation();
      evt.preventDefault();
      if (evt.target !== this.adapter_.getActiveItem()) {
        this.adapter_.removeActiveItem();
        this.adapter_.setActiveItem(evt.target);
        this.cachedActiveItem_ = this.adapter_.getActiveItemIndex();
      }
      this.applyValueFromActiveItem_();
    }
  };

  /**
   * Opens the item list.
   */
  open_() {
    const {LIST_OPEN,OPEN} = cssClasses;
    this.setListStyles_();
    this.adapter_.addClass(OPEN);
    this.adapter_.addClassToList(LIST_OPEN);
    this.isOpen_ = true;
  }

  /**
   * Closes the item list.
   * @param {Event=} evt
   */
  close_() {
    const {LIST_OPEN,OPEN} = cssClasses;
    this.adapter_.removeClass(OPEN);
    this.adapter_.removeClassFromList(LIST_OPEN);
    this.isOpen_ = false;
  }

  showHelptext_() {
    const {ARIA_HIDDEN} = strings;
    this.adapter_.removeHelptextAttr(ARIA_HIDDEN);
  }

  updateHelptextOnDeactivation_(isValid) {
    const {HELPTEXT_PERSISTENT, HELPTEXT_VALIDATION_MSG} = cssClasses;
    const {ALERT_ROLE, ROLE} = strings;
    const helptextIsPersistent = this.adapter_.helptextHasClass(HELPTEXT_PERSISTENT);
    const helptextIsValidationMsg = this.adapter_.helptextHasClass(HELPTEXT_VALIDATION_MSG);
    const validationMsgNeedsDisplay = helptextIsValidationMsg && !isValid;

    if (validationMsgNeedsDisplay) {
      this.adapter_.setHelptextAttr(ROLE, ALERT_ROLE);
    } else {
      this.adapter_.removeHelptextAttr(ROLE);
    }

    if (helptextIsPersistent || validationMsgNeedsDisplay) {
      return;
    }
    this.hideHelptext_();
  }

  hideHelptext_() {
    const {ARIA_HIDDEN} = strings;
    this.adapter_.setHelptextAttr(ARIA_HIDDEN, 'true');
  }

  setListStyles_() {
    const comboboxHeight = this.adapter_.getComboboxElOffsetHeight();
    const comboboxTop = this.adapter_.getComboboxElOffsetTop();

    this.adapter_.setListElStyle('top', `${comboboxHeight + comboboxTop}px`);
  }

  applyQuery_(value) {
    const {ARIA_HIDDEN} = strings;
    const {ITEM_NOMATCH} = cssClasses;
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
    this.refreshItems();
  }

  updateAvailableItems_() {
    // Debounce multiple changed values
    clearTimeout(this.changeValueTriggerTimerId_);
    this.changeValueTriggerTimerId_ = setTimeout(() => {
      if (this.adapter_.hasItemsLoader())
        this.adapter_.applyItemsLoader(this.lastInputValue_);
      else {
        this.applyQuery_(this.lastInputValue_);
      }
    }, numbers.CHANGE_VALUE_TRIGGER_DELAY);
  }

  updateInputStatus_() {
    const {MAXLENGTH} = strings;
    if (this.isFull_())
      this.adapter_.setInputAttr(MAXLENGTH,0);
    else
      this.adapter_.removeInputAttr(MAXLENGTH);
  }

  applyValueFromActiveItem_() {
    let currentDescription = this.adapter_.getActiveItemDescription();
    let currentValue = this.adapter_.getActiveItemValue();
    if ((this.maxSelectedItems_ == 1) && (this.adapter_.getNumberOfSelectedOptions() > 0))
      this.adapter_.removeSelectedOption(0);
    this.adapter_.addSelectedOption(currentValue, currentDescription);
    this.setValue(currentValue);
    this.clearInput_();
    this.updateInputStatus_();
    this.adapter_.notifyChange();
    this.close_();
  }

  clearInput_() {
    this.lastInputValue_ = '';
    this.setInputValue('');
  }

  /**
   * @return {boolean}
   * @private
   */
  isFull_() {
    return (this.maxSelectedItems_ !== null) && (this.adapter_.getNumberOfSelectedOptions() >= this.maxSelectedItems_);
  }

  /**
   * @return {!HTMLElementState}
   * @private
   */
  getNativeElement_() {
    return this.adapter_.getNativeElement();
  }

  /**
   * @return {!InputElementState}
   * @private
   */
  getNativeInput_() {
    return this.adapter_.getNativeInput() || {
      disabled: false,
      value: null
    };
  }

}
