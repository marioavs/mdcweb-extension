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

import MDCFoundation from '@material/base/foundation';
import {MDCExtMultiselectAdapter, NativeInputType, FoundationMapType} from './adapter';
import MDCExtMultiselectBottomLineFoundation from './bottom-line/foundation';
import MDCExtMultiselectLabelFoundation from './label/foundation';
import {cssClasses, strings, numbers} from './constants';

/** @const {!Array<@dict>} */
const OPENER_KEYS = [
  {key: 'ArrowUp', keyCode: 38, forType: 'keydown'},
  {key: 'ArrowDown', keyCode: 40, forType: 'keydown'}
];

/**
 * @final @extends {MDCFoundation<!MDCExtMultiselectAdapter>}
 */
export default class MDCExtMultiselectFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {number} */
  static get numbers() {
    return numbers;
  }

  /**
   * {@see MDCExtMultiselectAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCExtMultiselectAdapter}
   */
  static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      addClassToList: (/* className: string */) => {},
      removeClassFromList: (/* className: string */) => {},
      setAttr: (/* attr: string, value: string */) => {},
      removeAttr: (/* attr: string */) => {},
      hasClass: (/* className: string */) => /* boolean */ false,
      hasNecessaryDom: () => /* boolean */ false,
      eventTargetInComponent: () => false,
      eventTargetHasClass: () => false,
      getComboboxElOffsetHeight: () => /* number */ 0,
      getComboboxElOffsetTop: () => /* number */ 0,
      getComboboxElOffsetWidth: () => /* number */ 0,
      registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
      registerInputInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInputInteractionHandler: (/* type: string, handler: EventListener */) => {},
      registerBottomLineEventHandler: () => {},
      deregisterBottomLineEventHandler: () => {},
      registerDocumentInteractionHandler: () => {},
      deregisterDocumentInteractionHandler: () => {},
      registerListInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterListInteractionHandler: (/* type: string, handler: EventListener */) => {},
      addItem: (/* value: string, description: string, rawdata: string */) => {},
      removeItems: () => {},
      addSelectedOption: (/* value: string, description: string, rawdata: string */) => {},
      removeSelectedOption: (/* index: number */) => {},
      updateSelectedOption: (/* index: number, value: string, description: string, rawdata: string */) => {},
      setListElStyle: (/* propertyName: string, value: string */) => {},
      getNumberOfSelectedOptions: () => /* number */ 0,
      getNumberOfItems: () => /* number */ 0,
      getNumberOfAvailableItems: () => /* number */ 0,
      getSelectedOptions: () => /* HTMLElement */ {},
      getSelectedOptionValue: (/* index: number */) => /* string */ '',
      getSelectedOptionRawdata: (/* index: number */) => /* string */ null,
      getActiveItem: () => /* HTMLElement */ {},
      getActiveItemDescription: () => /* string */ '',
      getActiveItemIndex: () => /* number */ 0,
      getActiveItemRawdata: () => /* string */ null,
      getActiveItemValue: () => /* string */ '',
      setActiveItem: (/* item: HTMLElement */) => {},
      setActiveForItemAtIndex: (/* index: number */) => {},
      removeActiveItem: () => {},
      isActiveItemAvailable: () => /* boolean */ false,
      getTextForItemAtIndex: (/* index: number */) => /* string */ '',
      getRawdataForItemAtIndex: (/* index: number */) => /* string */ null,
      getValueForItemAtIndex: (/* index: number */) => /* string */ '',
      addClassForItemAtIndex: (/* index: number, className: string */) => {},
      rmClassForItemAtIndex: (/* index: number, className: string */) => {},
      setAttrForItemAtIndex: (/* index: number, attr: string, value: string */) => {},
      rmAttrForItemAtIndex: (/* index: number, attr: string */) => {},
      scrollActiveItemIntoView: () => {},
      notifyChange: () => {},
      setInputAttr: (/* attr: string, value: string */) => {},
      inputFocus: () => {},
      isInputFocused: () => {},
      registerInputInteractionHandler: () => {},
      deregisterInputInteractionHandler: () => {},
      getNativeInput: () => /* HTMLInputElement */ {}
    };
  }

  /**
   * @param {!MDCExtMultiselectAdapter=} adapter
   * @param {!FoundationMapType=} foundationMap Map from subcomponent names to their subfoundations.
   */
  constructor(adapter = /** @type {!MDCExtMultiselectAdapter} */ ({}),
    foundationMap = /** @type {!FoundationMapType} */ ({})) {
    super(Object.assign(MDCExtMultiselectFoundation.defaultAdapter, adapter));

    /** @type {!MDCExtMultiselectBottomLineFoundation|undefined} */
    this.bottomLine_ = foundationMap.bottomLine;
    /** @type {!MDCExtMultiselectLabelFoundation|undefined} */
    this.label_ = foundationMap.label;

    this.settings_ = this.getDefaultSettings_();
    /** @private {boolean} */
    this.isFocused_ = false;
    /** @private {boolean} */
    this.isOpen_ = false;
    /** @private {boolean} */
    this.isOpening_ = false;
    /** @private {boolean} */
    this.useCustomValidityChecking_ = false;
    /** @private {boolean} */
    this.isValid_ = true;
    this.lastInputValue_ = undefined;
    this.cachedNumberOfAvailableItems_ = 0;
    this.cachedActiveItem_ = undefined;
    this.isEmpty_ = true;
    this.isFull_ = false;
    /** @private {boolean} */
    this.receivedTouchMove_ = false;
    /** @private {number} */
    this.changeValueTriggerTimerId_ = 0;
    this.focusHandler_ = () => this.activateFocus_();
    this.blurHandler_ = () => this.deactivateFocus_();
    this.interactionHandler_ = (evt) => this.handleInteraction_(evt);
    this.keydownHandler_ = (evt) => this.handleKeydown_(evt);
    this.keyupHandler_ = (evt) => this.handleKeyup_(evt);
    /** @private {function(!Event)} */
    this.inputInputHandler_ = (evt) => this.handleInputInput_(evt);
    /** @private {function(!Event): undefined} */
    this.setPointerXOffset_ = (evt) => this.setBottomLineTransformOrigin(evt);
    /** @private {function(!Event): undefined} */
    this.bottomLineAnimationEndHandler_ = () => this.handleBottomLineAnimationEnd();
    /** @private {function(!Event)} */
    this.documentInteractionHandler_ = (evt) => this.handleDocumentInteraction_(evt);
  }

  init() {
    const {ROOT, OPEN, UPGRADED} = cssClasses;
    const {AUTOCOMPLETE, AUTOCORRECT, SPELLCHECK} = strings;

    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (!this.adapter_.hasNecessaryDom()) {
      throw new Error(`Required DOM nodes missing in ${ROOT} component.`);
    }

    this.adapter_.addClass(UPGRADED);
    if (this.adapter_.isInputFocused()) {
      this.inputFocusHandler_();
    }
    this.updateStatus_();
    // Ensure label does not collide with any pre-filled value.
    if (this.label_ && this.getValue()) {
      this.label_.styleFloat(
        this.getValue(), this.isFocused_, this.isBadInput_());
    }

    if (this.adapter_.hasClass(OPEN)) {
      this.open_();
    }

    this.adapter_.setInputAttr(AUTOCOMPLETE, 'nope');
    this.adapter_.setInputAttr(AUTOCORRECT, 'off');
    this.adapter_.setInputAttr(SPELLCHECK, 'false');
    ['click', 'mousedown', 'mouseup'].forEach((evtType) => {
      this.adapter_.registerInteractionHandler(evtType, this.interactionHandler_);
    });
    this.adapter_.registerInteractionHandler('keydown', this.keydownHandler_);
    this.adapter_.registerInteractionHandler('keyup', this.keyupHandler_);
    this.adapter_.registerBottomLineEventHandler(
      MDCExtMultiselectBottomLineFoundation.strings.ANIMATION_END_EVENT, this.bottomLineAnimationEndHandler_);
    this.adapter_.registerInputInteractionHandler('focus', this.focusHandler_);
    this.adapter_.registerInputInteractionHandler('blur', this.blurHandler_);
    this.adapter_.registerInputInteractionHandler('input', this.inputInputHandler_);
    ['mousedown', 'touchstart'].forEach((evtType) => {
      this.adapter_.registerInteractionHandler(evtType, this.setPointerXOffset_);
    });
    if ((this.getSettings().maxSelectedItems === 1) && (this.adapter_.getNumberOfSelectedOptions() === 0))
      this.adapter_.addSelectedOption('', '');
    this.resize_();
  }

  destroy() {
    const {UPGRADED} = cssClasses;

    clearTimeout(this.changeValueTriggerTimerId_);
    this.adapter_.removeClass(UPGRADED);
    ['click', 'mousedown', 'mouseup'].forEach((evtType) => {
      this.adapter_.deregisterInteractionHandler(evtType, this.interactionHandler_);
    });
    this.adapter_.deregisterInteractionHandler('keydown', this.keydownHandler_);
    this.adapter_.deregisterInteractionHandler('keyup', this.keyupHandler_);
    this.adapter_.deregisterBottomLineEventHandler(
      MDCExtMultiselectBottomLineFoundation.strings.ANIMATION_END_EVENT, this.bottomLineAnimationEndHandler_);
    this.adapter_.deregisterInputInteractionHandler('focus', this.focusHandler_);
    this.adapter_.deregisterInputInteractionHandler('blur', this.blurHandler_);
    this.adapter_.deregisterInputInteractionHandler('input', this.inputInputHandler_);
    ['mousedown', 'touchstart'].forEach((evtType) => {
      this.adapter_.deregisterInteractionHandler(evtType, this.setPointerXOffset_);
    });
    if (this.isOpen()) {
      ['click', 'touchstart', 'touchmove', 'touchend'].forEach((evtType) => {
        this.adapter_.deregisterDocumentInteractionHandler(evtType, this.documentInteractionHandler_, false);
      });
      this.adapter_.deregisterDocumentInteractionHandler('focus', this.documentInteractionHandler_, true);
    }
  }

  getSettings() {
    return this.settings_ ;
  }

  setSettings(settings) {
    Object.assign(this.settings_, settings);
  }

  getDefaultSettings_() {
    return {
      itemValueProperty: 'value',
      itemDescriptionProperty: 'description',
      itemsLoader: undefined,
      maxSelectedItems: 1
    };
  }

  /** @return {?string} */
  getValue() {
    if (this.adapter_.getNumberOfSelectedOptions() > 0)
      return this.adapter_.getSelectedOptionValue(0);
    return '';
  }

  /** @param {?string} value */
  setValue(value) {
    const {INVALID, LABEL_FLOAT_ABOVE} = cssClasses;
    if (this.isFull_)
      this.removeLastSelection_();
    this.clearInput_();
    if (value) {
      let itemValue = '';
      for (let i = 0, l = this.adapter_.getNumberOfItems(); i < l; i++) {
         itemValue = this.adapter_.getValueForItemAtIndex(i);
         if (itemValue === value) {
           let itemDescription = this.adapter_.getTextForItemAtIndex(i);
           let itemRawdata = this.adapter_.getRawdataForItemAtIndex(i);
           if ((this.getSettings().maxSelectedItems === 1) && (this.adapter_.getNumberOfSelectedOptions() > 0))
             this.adapter_.updateSelectedOption(0, itemValue, itemDescription, itemRawdata);
           else
             this.adapter_.addSelectedOption(itemValue, itemDescription, itemRawdata);
           this.updateStatus_();
           break;
         }
      }
    }
    const isValid = this.isValid();
    this.styleValidity_(isValid);
    this.styleFocused_(this.isFocused_);
    if (this.label_) {
      this.label_.styleShake(this.isValid(), this.isFocused_);
      this.label_.styleFloat(
        this.getValue(), this.isFocused_, this.isBadInput_());
    }
    if (!this.isFocused_)
      this.clearInput_();
    this.adapter_.notifyChange();
  }

  /** @return {?string} */
  getRawdata() {
    if (this.adapter_.getNumberOfSelectedOptions() > 0)
      return this.adapter_.getSelectedOptionRawdata(0);
    return null;
  }

  /** @param {?string} value */
  setRawdata(rawdata) {
    const {INVALID, LABEL_FLOAT_ABOVE} = cssClasses;
    if (!rawdata) {
      this.setValue('');
      return;
    }
    const settings = this.getSettings();
    if (this.isFull_)
      this.removeLastSelection_();
    this.clearInput_();
    let rawObject = JSON.parse(rawdata);
    let value = rawObject[settings.itemValueProperty];
    let description = rawObject[settings.itemDescriptionProperty];
    if ((!value) || (!description)){
      this.setValue('');
      return;
    }
    if ((this.getSettings().maxSelectedItems === 1) && (this.adapter_.getNumberOfSelectedOptions() > 0))
      this.adapter_.updateSelectedOption(0, value, description, JSON.stringify(rawObject));
    else
      this.adapter_.addSelectedOption(value, description, JSON.stringify(rawObject));
    this.updateStatus_();

    const isValid = this.isValid();
    this.styleValidity_(isValid);
    this.styleFocused_(this.isFocused_);
    if (this.label_) {
      this.label_.styleShake(this.isValid(), this.isFocused_);
      this.label_.styleFloat(
        this.getValue(), this.isFocused_, this.isBadInput_());
    }
    if (!this.isFocused_)
      this.clearInput_();
    this.adapter_.notifyChange();
  }

  /**
   * @return {boolean} If a custom validity is set, returns that value.
   *     Otherwise, returns the result of native validity checks.
   */
  isValid() {
    return this.useCustomValidityChecking_
      ? this.isValid_ : this.isNativeInputValid_();
  }

  /**
   * @param {boolean} isValid Sets the validity state of the Date Picker.
   */
  setValid(isValid) {
    this.useCustomValidityChecking_ = true;
    this.isValid_ = isValid;
    // Retrieve from the getter to ensure correct logic is applied.
    isValid = this.isValid();
    this.styleValidity_(isValid);
    if (this.label_) {
      this.label_.styleShake(isValid, this.isFocused_);
    }
  }

  /**
   * @return {boolean} True if the Date Picker is disabled.
   */
  isDisabled() {
    return this.getNativeInput_().disabled;
  }

  /**
   * @param {boolean} disabled Sets the Date Picker disabled or enabled.
   */
  setDisabled(disabled) {
    this.getNativeInput_().disabled = disabled;
    this.styleDisabled_(disabled);
  }

  /**
   * @return {boolean} True if the Date Picker is read only.
   */
  isReadOnly() {
    return this.getNativeInput_().readOnly;
  }

  /**
   * @param {boolean} readOnly Sets the Date Picker read only.
   */
  /** @param {boolean} readOnly */
  setReadOnly(readOnly) {
    this.getNativeInput_().readOnly = readOnly;
  }

  /**
   * @return {boolean} True if the Date Picker is required.
   */
  isRequired() {
    return this.getNativeInput_().required;
  }

  /**
   * @param {boolean} isRequired Sets the Date Picker required or not.
   */
  setRequired(isRequired) {
    this.getNativeInput_().required = isRequired;
    // Addition of the asterisk is automatic based on CSS, but validity checking
    // needs to be manually run.
    this.styleValidity_(this.isValid());
  }

  /**
   * @return {boolean} True if the Date Picker input fails in converting the
   *     user-supplied value.
   * @private
   */
  isBadInput_() {
    return this.getNativeInput_().validity.badInput;
  }

  /**
   * @return {boolean} The result of native validity checking
   *     (ValidityState.valid).
   */
  isNativeInputValid_() {
    return this.getNativeInput_().validity.valid;
  }

  /**
   * Styles the component based on the validity state.
   * @param {boolean} isValid
   * @private
   */
  styleValidity_(isValid) {
    const {INVALID} = cssClasses;
    if (isValid) {
      this.adapter_.removeClass(INVALID);
    } else {
      this.adapter_.addClass(INVALID);
    }
    if (this.helperText_) {
      this.helperText_.setValidity(isValid);
    }
  }

  /**
   * Styles the component based on the focused state.
   * @param {boolean} isFocused
   * @private
   */
  styleFocused_(isFocused) {
    const {FOCUSED} = cssClasses;
    if (isFocused) {
      this.adapter_.addClass(FOCUSED);
    } else {
      this.adapter_.removeClass(FOCUSED);
    }
  }

  /**
   * Styles the component based on the disabled state.
   * @param {boolean} isDisabled
   * @private
   */
  styleDisabled_(isDisabled) {
    const {DISABLED, INVALID} = cssClasses;
    const {ARIA_DISABLED} = strings;
    if (isDisabled) {
      this.adapter_.setAttr(ARIA_DISABLED, 'true');
      this.adapter_.addClass(DISABLED);
      this.adapter_.removeClass(INVALID);
    } else {
      this.adapter_.removeAttr(ARIA_DISABLED);
      this.adapter_.removeClass(DISABLED);
    }
  }

  resize_() {
    const comboboxWidth = this.adapter_.getComboboxElOffsetWidth();

    this.adapter_.setListElStyle('min-width', `${comboboxWidth}px`);
  }

  activateFocus_() {
    this.isFocused_ = true;
    this.updateStatus_();
    this.styleFocused_(this.isFocused_);
    if (this.bottomLine_) {
      this.bottomLine_.activate();
    }
    if (this.label_) {
      this.label_.styleShake(this.isValid(), this.isFocused_);
      this.label_.styleFloat(
        this.getValue(), this.isFocused_, this.isBadInput_());
    }
    if (!this.isOpen()) {
      this.cachedNumberOfAvailableItems_ = this.adapter_.getNumberOfAvailableItems();
      if ((this.cachedActiveItem_ === undefined) && (this.cachedNumberOfAvailableItems_ > 0)) {
        this.adapter_.removeActiveItem();
        this.cachedActiveItem_ = 0;
        this.adapter_.setActiveForItemAtIndex(this.cachedActiveItem_);
      }
      if (this.cachedNumberOfAvailableItems_ == 0)
        this.updateAvailableItems_();
      else if (this.isEmpty_)
        this.open_();
    }
  }

  deactivateFocus_() {
    this.isFocused_ = this.isOpen();
    const isValid = this.isValid();
    this.styleValidity_(isValid);
    this.styleFocused_(this.isFocused_);
    if (this.label_) {
      this.label_.styleShake(this.isValid(), this.isFocused_);
      this.label_.styleFloat(
        this.getValue(), this.isFocused_, this.isBadInput_());
    }
    if (!this.isFocused_)
      this.clearInput_();
  }

  /**
   * Sets the bottom line's transform origin, so that the bottom line activate
   * animation will animate out from the user's click location.
   * @param {!Event} evt
   */
  setBottomLineTransformOrigin(evt) {
    if (this.bottomLine_) {
      this.bottomLine_.setTransformOrigin(evt);
    }
  }

  /**
   * Handles when bottom line animation ends, performing actions that must wait
   * for animations to finish.
   */
  handleBottomLineAnimationEnd() {
    // We need to wait for the bottom line to be entirely transparent
    // before removing the class. If we do not, we see the line start to
    // scale down before disappearing
    if (!this.isFocused_ && this.bottomLine_) {
      this.bottomLine_.deactivate();
    }
  }

  /** @return {boolean} */
  isOpen() {
    return this.isOpen_;
  }

  /**
   * Opens the item list.
   */
  open_() {
    const {LIST_OPEN,OPEN} = cssClasses;

    if (this.isDisabled()) {
      return;
    }
    this.isOpening_ = true;
    this.resize_();
    this.setListStyles_();
    ['click', 'touchstart', 'touchmove', 'touchend'].forEach((evtType) => {
      this.adapter_.registerDocumentInteractionHandler(evtType, this.documentInteractionHandler_, false);
    });
    this.adapter_.registerDocumentInteractionHandler('focus', this.documentInteractionHandler_, true);
    this.adapter_.addClass(OPEN);
    this.adapter_.addClassToList(LIST_OPEN);
    this.isOpen_ = true;
    // this.adapter_.scrollActiveItemIntoView();
    setTimeout(() => {
      this.isOpening_ = false;
    }, numbers.OPENING_END_LATCH_MS);
  }

  /**
   * Closes the item list.
   */
  close_() {
    const {LIST_OPEN,OPEN} = cssClasses;

    ['click', 'touchstart', 'touchmove', 'touchend'].forEach((evtType) => {
      this.adapter_.deregisterDocumentInteractionHandler(evtType, this.documentInteractionHandler_, false);
    });
    this.adapter_.deregisterDocumentInteractionHandler('focus', this.documentInteractionHandler_, true);
    this.adapter_.removeClass(OPEN);
    this.adapter_.removeClassFromList(LIST_OPEN);
    this.isOpen_ = false;
    if (!this.adapter_.isInputFocused())
      this.deactivateFocus_();
  }

  getNumberOfSelectedOptions() {
    return this.adapter_.getNumberOfSelectedOptions();
  }

  addItems(items) {
    if (!Array.isArray(items))
      return;
    const settings =  this.getSettings();
    let value = '';
    let description = ''
    for (let i = 0, l = items.length; i < l; i++) {
      value = items[i][settings.itemValueProperty];
      description = items[i][settings.itemDescriptionProperty];
      if ((value) && (description))
        this.adapter_.addItem(value, description, JSON.stringify(items[i]));
    }
  }

  removeItems() {
    this.adapter_.removeItems();
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
    if (!this.isOpen() && this.isEmpty_ && (this.adapter_.isInputFocused())) {
      this.open_();
    }
  }

  handleInteraction_(evt) {
    const {LIST, LIST_ITEM} = cssClasses;

    if ((evt.type === 'mousedown') || (evt.type === 'mouseup')) {
      // avoid blur event
      if ((evt.target) && (!this.adapter_.eventTargetHasClass(evt.target, LIST_ITEM))) {
        evt.preventDefault();
        return false;
      }
    } else if (evt.type === 'click') {
      if ((evt.target) && (this.adapter_.eventTargetHasClass(evt.target, LIST_ITEM))) {
        if (this.isDisabled()) {
          return;
        }
        if (evt.target !== this.adapter_.getActiveItem()) {
          this.adapter_.removeActiveItem();
          this.adapter_.setActiveItem(evt.target);
          this.cachedActiveItem_ = this.adapter_.getActiveItemIndex();
        }
        this.adapter_.inputFocus();
        this.applyValueFromActiveItem_();
      } else if ((evt.target) && (this.adapter_.eventTargetHasClass(evt.target, LIST))) {
        // android chrome is giving the list as the event target on some combination of scrolling events
        if ((this.cachedActiveItem_ !== undefined) && (this.cachedActiveItem_ < (this.cachedNumberOfAvailableItems_ - 1))) {
          this.adapter_.focusItemAtIndex(this.cachedActiveItem_);
        }
      } else {
        if (!this.isOpen()) {
          if (!this.isFocused_) {
            this.adapter_.inputFocus();
          } else {
            this.open_();
          }
        } else if (!this.isOpening_) {
          this.adapter_.inputFocus();
          this.close_();
        }
      }
    }
  }

  handleKeydown_(evt) {
    const {INPUT} = cssClasses;

    if (this.isDisabled()) {
      return;
    }
    // Do nothing if Alt, Ctrl or Meta are pressed.
    if (evt.altKey || evt.ctrlKey || evt.metaKey) {
      return;
    }
    // Do nothing if F1 - F12 are pressed.
    if ((evt.keyCode >= 112) && (evt.keyCode <= 123)) {
      return;
    }
    const {keyCode, key, shiftKey} = evt;
    const isBackspace = key === 'Backspace' || keyCode === 8;
    const isTab = key === 'Tab' || keyCode === 9;
    const isEnter = key === 'Enter' || keyCode === 13;
    const isEscape = key === 'Escape' || keyCode === 27;
    const isArrowUp = key === 'ArrowUp' || keyCode === 38;
    const isArrowDown = key === 'ArrowDown' || keyCode === 40;
    const isSpace = key === 'Space' || keyCode === 32;

    if (this.isOpen() && (isTab || isEnter)) {
      if (shiftKey) {
        evt.preventDefault();
        this.adapter_.inputFocus();
        this.close_();
      } else {
        let currentItem = this.adapter_.getActiveItem();
        if (currentItem != null) {
          this.adapter_.inputFocus();
          this.applyValueFromActiveItem_();
        }
      }
    }
    if (!this.isOpen() && (evt.target) && (this.adapter_.eventTargetHasClass(evt.target, INPUT))) {
      if ((this.isFull_) && (!isBackspace) && (!isTab) && (!isEnter)) {
        evt.preventDefault();
        return false;
      }
    } else {
      if (isTab || isEnter) {
        evt.preventDefault();
      } else if (isArrowUp) {
        evt.preventDefault();
        if ((this.cachedActiveItem_ !== undefined) && (this.cachedActiveItem_ > 0)) {
          this.adapter_.removeActiveItem();
          this.cachedActiveItem_--;
          this.adapter_.setActiveForItemAtIndex(this.cachedActiveItem_);
          this.adapter_.focusItemAtIndex(this.cachedActiveItem_);
        }
      } else if (isArrowDown) {
        evt.preventDefault();
        if ((this.cachedActiveItem_ !== undefined) && (this.cachedActiveItem_ < (this.cachedNumberOfAvailableItems_ - 1))) {
          this.adapter_.removeActiveItem();
          this.cachedActiveItem_++;
          this.adapter_.setActiveForItemAtIndex(this.cachedActiveItem_);
          this.adapter_.focusItemAtIndex(this.cachedActiveItem_);
        }
      } else if (isEscape) {
        evt.preventDefault();
        evt.stopPropagation();
        this.adapter_.inputFocus();
        this.close_();
      }
    }
    if ((isBackspace) && (this.getNativeInput_().selectionStart == 0)) {
      if (this.adapter_.getNumberOfSelectedOptions() > 0) {
        this.removeLastSelection_();
        this.adapter_.inputFocus();
      }
    }
  }

  handleKeyup_(evt) {
    const {INPUT} = cssClasses;

    // Do nothing if Alt, Ctrl or Meta are pressed.
    if (evt.altKey || evt.ctrlKey || evt.metaKey) {
      return true;
    }
    if (this.isDisabled()) {
      return;
    }

    const {keyCode, key, shiftKey} = evt;
    const isBackspace = key === 'Backspace' || keyCode === 8;
    const isTab = key === 'Tab' || keyCode === 9;
    const isEnter = key === 'Enter' || keyCode === 13;
    const isEscape = key === 'Escape' || keyCode === 27;
    const isArrowUp = key === 'ArrowUp' || keyCode === 38;
    const isArrowDown = key === 'ArrowDown' || keyCode === 40;
    const isSpace = key === 'Space' || keyCode === 32;

    if ((evt.target) && (this.adapter_.eventTargetHasClass(evt.target, INPUT))) {
      if ((isArrowDown || isArrowUp) && !this.isOpen()) {
        this.open_();
      }
    }
  }

  handleInputInput_(evt = null) {
    const {keyCode, key, shiftKey} = evt;
    const isBackspace = key === 'Backspace' || keyCode === 8;
    const isTab = key === 'Tab' || keyCode === 9;
    const isEnter = key === 'Enter' || keyCode === 13;
    if ((this.isFull_) && (!isBackspace) && (!isTab) && (!isEnter)) {
      evt.preventDefault();
      this.getNativeInput_().value = '';
      return false;
    }
    let currentValue = evt ? evt.target.value : this.getNativeInput_().value;
    if (currentValue !== this.lastInputValue_) {
      this.lastInputValue_ = currentValue;
      this.updateAvailableItems_();
    }
  }

  /**
   * Handle clicks and cancel the component if not a children
   * @param {!Event} evt
   * @private
   */
  handleDocumentInteraction_(evt) {
    if ((evt.target) && this.adapter_.eventTargetInComponent(evt.target)) {
      return;
    }
    if (evt.type === 'focus') {
      this.close_();
    } else if (evt.type === 'click') {
      this.close_();
    } else if (evt.type === 'touchstart') {
      this.receivedTouchMove_ =  false;
    } else if (evt.type === 'touchmove') {
      this.receivedTouchMove_ =  true;
    } else if (evt.type === 'touchend') {
      if (!this.receivedTouchMove_) {
        this.close_();
      }
      this.receivedTouchMove_ =  false;
    }
  };

  setListStyles_() {
    const comboboxHeight = this.adapter_.getComboboxElOffsetHeight();
    const comboboxTop = this.adapter_.getComboboxElOffsetTop();

    this.adapter_.setListElStyle('top', `${comboboxHeight + comboboxTop}px`);
  }

  removeLastSelection_() {
    if (this.adapter_.getNumberOfSelectedOptions() > 0) {
      if ((this.getSettings().maxSelectedItems === 1) && (this.adapter_.getNumberOfSelectedOptions() === 1))
        this.adapter_.updateSelectedOption(0,'','');
      else
        this.adapter_.removeSelectedOption(this.adapter_.getNumberOfSelectedOptions() - 1);
      this.updateStatus_();
    }
  }

  applyItemsLoader_(query) {
    var self = this;
    this.getSettings().itemsLoader.apply(self, [query, function(results) {
      if (results && results.length) {
        requestAnimationFrame(() => {
          self.removeItems();
          self.addItems(results);
          self.refreshItems();
        });
      }
    }]);
  }

  applyQuery_(value) {
    const {ARIA_HIDDEN} = strings;
    const {ITEM_NOMATCH} = cssClasses;
    requestAnimationFrame(() => {
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
    });
  }

  updateAvailableItems_() {
    if (this.isDisabled()) {
      return;
    }
    // Debounce multiple changed values
    clearTimeout(this.changeValueTriggerTimerId_);
    this.changeValueTriggerTimerId_ = setTimeout(() => {
      if (typeof this.getSettings().itemsLoader === 'function')
        this.applyItemsLoader_(this.lastInputValue_);
      else {
        this.applyQuery_(this.lastInputValue_);
      }
    }, numbers.CHANGE_VALUE_TRIGGER_DELAY);
  }

  updateStatus_() {
    let maxSelectedItems = this.getSettings().maxSelectedItems;
    this.isFull_ = ((maxSelectedItems !== null) &&
      (((maxSelectedItems === 1) && (this.adapter_.getNumberOfSelectedOptions() === 1) && (this.adapter_.getSelectedOptionValue(0))) ||
      ((maxSelectedItems > 1) && (this.adapter_.getNumberOfSelectedOptions() >= maxSelectedItems))));
    this.isEmpty_ = ((this.adapter_.getNumberOfSelectedOptions() === 0) ||
      ((maxSelectedItems === 1) && (!this.adapter_.getSelectedOptionValue(0))));
  }

  applyValueFromActiveItem_() {
    let currentDescription = this.adapter_.getActiveItemDescription();
    let currentValue = this.adapter_.getActiveItemValue();
    let currentRawdata = this.adapter_.getActiveItemRawdata();
    if ((this.getSettings().maxSelectedItems === 1) && (this.adapter_.getNumberOfSelectedOptions() > 0))
      this.adapter_.updateSelectedOption(0, currentValue, currentDescription, currentRawdata);
    else
      this.adapter_.addSelectedOption(currentValue, currentDescription, currentRawdata);
    this.clearInput_();
    this.updateStatus_();
    this.adapter_.notifyChange();
    this.close_();
  }

  clearInput_() {
    this.lastInputValue_ = '';
    this.getNativeInput_().value = '';
  }

  /**
   * @return {!Element|!NativeInputType} The native text input from the
   * host environment, or a dummy if none exists.
   * @private
   */
  getNativeInput_() {
    return this.adapter_.getNativeInput() ||
    /** @type {!NativeInputType} */ ({
      value: '',
      disabled: false,
      readOnly: false,
      validity: {
        badInput: false,
        valid: true,
      }
    });
  }
}
