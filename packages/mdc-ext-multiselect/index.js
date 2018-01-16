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

import MDCComponent from '@material/base/component';
import {MDCExtMultiselectAdapter, FoundationMapType} from './adapter';
import MDCExtMultiselectFoundation from './foundation';
/* eslint-disable no-unused-vars */
import {MDCExtMultiselectBottomLine, MDCExtMultiselectBottomLineFoundation} from './bottom-line';
import {MDCExtMultiselectLabel, MDCExtMultiselectLabelFoundation} from './label';
/* eslint-enable no-unused-vars */

/**
 * @extends {MDCComponent<!MDCExtMultiselectFoundation>}
 * @final
 */
class MDCExtMultiselect extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?MDCExtMultiselectBottomLine} */
    this.bottomLine_;
    /** @private {?Element} */
    this.comboboxEl_;
    /** @private {?Element} */
    this.displayEl_;
    /** @private {?Element} */
    this.input_;
    /** @private {?MDCExtMultiselectLabel} */
    this.label_;
    /** @private {?Element} */
    this.listEl_;
    /** @private {?Element} */
    this.listUl_;
    /** @private {?Element} */
    this.selectEl_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCExtMultiselect}
   */
  static attachTo(root) {
    return new MDCExtMultiselect(root);
  }

  /**
   * @param {(function(!Element): !MDCExtMultiselectBottomLine)=} bottomLineFactory A function which
   * creates a new MDCExtMultiselectBottomLine.
   * @param {(function(!Element): !MDCExtMultiselectLabel)=} labelFactory A function which
   * creates a new MDCExtMultiselectLabel.
   */
  initialize(
    bottomLineFactory = (el) => new MDCExtMultiselectBottomLine(el),
    labelFactory = (el) => new MDCExtMultiselectLabel(el)) {
    const bottomLineElement = this.root_.querySelector(MDCExtMultiselectFoundation.strings.BOTTOM_LINE_SELECTOR);
    if (bottomLineElement) {
      this.bottomLine_ = bottomLineFactory(bottomLineElement);
    }
    this.comboboxEl_ = this.root_.querySelector(MDCExtMultiselectFoundation.strings.COMBOBOX_SELECTOR);
    this.displayEl_ = this.root_.querySelector(MDCExtMultiselectFoundation.strings.DISPLAY_SELECTOR);
    this.input_ = this.root_.querySelector(MDCExtMultiselectFoundation.strings.INPUT_SELECTOR);
    const labelElement = this.root_.querySelector(MDCExtMultiselectFoundation.strings.LABEL_SELECTOR);
    if (labelElement) {
      this.label_ = labelFactory(labelElement);
    }
    this.listEl_ = this.root_.querySelector(MDCExtMultiselectFoundation.strings.LIST_SELECTOR);
    this.listUl_ = this.listEl_.querySelector('ul');
    this.selectEl_ = this.root_.querySelector(MDCExtMultiselectFoundation.strings.SELECT_SELECTOR);
  }

  destroy() {
    if (this.bottomLine_) {
      this.bottomLine_.destroy();
    }
    if (this.label_) {
      this.label_.destroy();
    }
    super.destroy();
  }

  /**
   * @return {!MDCExtMultiselectFoundation}
   */
  getDefaultFoundation() {
    return new MDCExtMultiselectFoundation(
      /** @type {!MDCExtMultiselectAdapter} */ (Object.assign({
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        addClassToList: (className) => this.listEl_.classList.add(className),
        removeClassFromList: (className) => this.listEl_.classList.remove(className),
        setAttr: (attr, value) => this.root_.setAttribute(attr, value),
        removeAttr: (attr) => this.root_.removeAttribute(attr),
        hasClass: (className) => this.root_.classList.contains(className),
        hasNecessaryDom: () => Boolean(this.comboboxEl_) && Boolean(this.displayEl_) && Boolean(this.input_) &&
          Boolean(this.listEl_) && Boolean(this.listUl_) && Boolean(this.selectEl_),
        eventTargetInComponent: (target) => this.root_.contains(target),
        eventTargetHasClass: (target, className) => target.classList.contains(className),
        getComboboxElOffsetHeight: () => this.comboboxEl_.offsetHeight,
        getComboboxElOffsetTop: () => this.comboboxEl_.offsetTop,
        getComboboxElOffsetWidth: () => this.comboboxEl_.offsetWidth,
        registerInteractionHandler: (type, handler) => this.root_.addEventListener(type, handler),
        deregisterInteractionHandler: (type, handler) => this.root_.removeEventListener(type, handler),
        registerBottomLineEventHandler: (evtType, handler) => (this.bottomLine_) && this.bottomLine_.listen(evtType, handler),
        deregisterBottomLineEventHandler: (evtType, handler) => (this.bottomLine_) && this.bottomLine_.unlisten(evtType, handler),
        registerDocumentInteractionHandler: (type, handler) => document.addEventListener(type, handler),
        deregisterDocumentInteractionHandler: (type, handler) => document.removeEventListener(type, handler),
        registerListInteractionHandler: (type, handler) => this.listEl_.addEventListener(type, handler),
        deregisterListInteractionHandler: (type, handler) => this.listEl_.removeEventListener(type, handler),
        addItem: (value, description, rawdata) => this.addItem_(value, description, rawdata),
        removeItems: () => this.removeItems_(),
        addSelectedOption: (value, description, rawdata = null) => this.addSelectedOption_(value, description, rawdata),
        removeSelectedOption: (index) => this.removeSelectedOption_(index),
        updateSelectedOption: (index, value, description, rawdata = null) => this.updateSelectedOption_(index, value, description, rawdata),
        setListElStyle: (propertyName, value) => this.listEl_.style.setProperty(propertyName, value),
        getNumberOfSelectedOptions: () => this.selectedOptions.length,
        getNumberOfItems: () => this.items.length,
        getNumberOfAvailableItems: () => this.availableItems.length,
        getSelectedOptions: () => this.selectedOptions,
        getSelectedOptionValue: (index) => this.selectedOptions[index].value,
        getSelectedOptionRawdata: (index) => this.selectedOptions[index].getAttribute(MDCExtMultiselectFoundation.strings.ITEM_DATA_RAWDATA_ATTR),
        getActiveItem: () => this.activeItem,
        getActiveItemDescription: () => this.activeItem.getAttribute(MDCExtMultiselectFoundation.strings.ITEM_DATA_DESC_ATTR) || this.activeItem.textContent,
        getActiveItemIndex: () => this.getActiveItemIndex_(),
        getActiveItemRawdata: () => this.activeItem.getAttribute(MDCExtMultiselectFoundation.strings.ITEM_DATA_RAWDATA_ATTR) || null,
        getActiveItemValue: () => this.activeItem.getAttribute(MDCExtMultiselectFoundation.strings.ITEM_DATA_VALUE_ATTR) || this.activeItem.id,
        setActiveItem: (item) => { item.classList.add(MDCExtMultiselectFoundation.cssClasses.ITEM_SELECTED) },
        setActiveForItemAtIndex: (index) => { this.availableItems[index].classList.add(MDCExtMultiselectFoundation.cssClasses.ITEM_SELECTED) },
        removeActiveItem: () => {
          if (this.activeItem) this.activeItem.classList.remove(MDCExtMultiselectFoundation.cssClasses.ITEM_SELECTED);
          // this.input_.focus();
        },
        isActiveItemAvailable: () => (this.activeItem && (!this.activeItem.classList.contains(MDCExtMultiselectFoundation.cssClasses.ITEM_NOMATCH))),
        getRawdataForItemAtIndex: (index) => this.items[index].getAttribute(MDCExtMultiselectFoundation.strings.ITEM_DATA_RAWDATA_ATTR) || null,
        getTextForItemAtIndex: (index) => this.items[index].getAttribute(MDCExtMultiselectFoundation.strings.ITEM_DATA_DESC_ATTR) || this.items[index].textContent,
        getValueForItemAtIndex: (index) => this.items[index].getAttribute(MDCExtMultiselectFoundation.strings.ITEM_DATA_VALUE_ATTR) || this.items[index].id,
        addClassForItemAtIndex: (index, className) => this.items[index].classList.add(className),
        rmClassForItemAtIndex: (index, className) => this.items[index].classList.remove(className),
        setAttrForItemAtIndex: (index, attr, value) => this.items[index].setAttribute(attr, value),
        rmAttrForItemAtIndex: (index, attr) => this.items[index].removeAttribute(attr),
        focusItemAtIndex: (index) => (this.availableItems[index]) && this.availableItems[index].focus(),
        scrollActiveItemIntoView: () => (this.activeItem && this.activeItem.scrollIntoView(false)),
        notifyChange: () => this.emit(MDCExtMultiselectFoundation.strings.CHANGE_EVENT, this)
      },
      this.getInputAdapterMethods_())),
      this.getFoundationMap_());
  }

  /**
   * @return {!{
   *   setInputAttr: function(string, string): undefined,
   *   inputFocus: function(): undefined,
   *   isInputFocused: function(): boolean,
   *   registerInputInteractionHandler: function(string, function()): undefined,
   *   deregisterInputInteractionHandler: function(string, function()): undefined,
   *   getNativeInput: function(): ?Element,
   * }}
   */
  getInputAdapterMethods_() {
    return {
      setInputAttr: (attr, value) => this.input_.setAttribute(attr, value),
      inputFocus: () => this.input_.focus(),
      isInputFocused: () => document.activeElement === this.input_,
      registerInputInteractionHandler: (evtType, handler) => this.input_.addEventListener(evtType, handler),
      deregisterInputInteractionHandler: (evtType, handler) => this.input_.removeEventListener(evtType, handler),
      getNativeInput: () => this.input_,
    };
  }

  /**
   * Returns a map of all subcomponents to subfoundations.
   * @return {!FoundationMapType}
   */
  getFoundationMap_() {
    return {
      bottomLine: this.bottomLine_ ? this.bottomLine_.foundation : undefined,
      label: this.label_ ? this.label_.foundation : undefined,
    };
  }

  /**
   * Initiliazes the Text Field's internal state based on the environment's
   * state.
   */
  initialSyncWithDOM() {
    const {ARIA_DISABLED} = MDCExtMultiselectFoundation.strings;

    let hasValue = false;
    let l = this.selectedOptions.length;
    if (l > 0) {
      for (let i = 0; i < l; i++) {
        if (this.selectedOptions[i].value) {
          hasValue = true;
          this.addDisplayOption_(this.selectedOptions[i].value, this.selectedOptions[i].textContent);
        }
      }
    }

    this.disabled = this.root_.getAttribute(ARIA_DISABLED) === 'true' ||
      this.input_.disabled;
  }

  /** @return {?string} */
  get value() {
    return this.foundation_.getValue();
  }

  set value(value) {
    this.foundation_.setValue(value);
  }

  /** @return {?string} */
  get rawdata() {
    return this.foundation_.getRawdata();
  }

  set rawdata(rawdata) {
    this.foundation_.setRawdata(rawdata);
  }

  get settings() {
    return this.foundation_.getSettings();
  }

  set settings(settings) {
    return this.foundation_.setSettings(settings);
  }

  get disabled() {
    return this.foundation_.isDisabled();
  }

  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  get items() {
    return this.listUl_.querySelectorAll(MDCExtMultiselectFoundation.strings.ITEM_SELECTOR);
  }

  get availableItems() {
    return this.listUl_.querySelectorAll(`${MDCExtMultiselectFoundation.strings.ITEM_SELECTOR}:not(.${MDCExtMultiselectFoundation.cssClasses.ITEM_NOMATCH})`);
  }

  get activeItem() {
    return this.listUl_.querySelector(`.${MDCExtMultiselectFoundation.cssClasses.ITEM_SELECTED}`);
  }

  get selectedOptions() {
    return this.selectEl_.querySelectorAll(`.${MDCExtMultiselectFoundation.cssClasses.SELECTED_OPTION}`);
  }

  get displayedOptions() {
    return this.displayEl_.querySelectorAll(`.${MDCExtMultiselectFoundation.cssClasses.SELECTED_OPTION}`);
  }

  removeItems() {
    this.foundation_.removeItems();
  }

  addItem_(value, description, rawdata) {
    if (this.listUl_ !== undefined) {
      const {LIST_ITEM} = MDCExtMultiselectFoundation.cssClasses;
      const {ITEM_DATA_VALUE_ATTR, ITEM_DATA_DESC_ATTR, ITEM_DATA_RAWDATA_ATTR} = MDCExtMultiselectFoundation.strings;
      var node = document.createElement('li');
      node.classList.add(LIST_ITEM);
      node.setAttribute('role', 'option');
      node.setAttribute('tabindex', '0');
      node.setAttribute(ITEM_DATA_VALUE_ATTR, value);
      node.setAttribute(ITEM_DATA_DESC_ATTR, description);
      if (rawdata)
        node.setAttribute(ITEM_DATA_RAWDATA_ATTR, rawdata);
      node.textContent = description;
      this.listUl_.appendChild(node);
    }
  }

  removeItems_() {
    if (this.listUl_ !== undefined) {
      while(this.listUl_.hasChildNodes()) this.listUl_.removeChild(this.listUl_.firstChild);
    }
  }

  addSelectedOption_(value, description, rawdata) {
    const {SELECTED_OPTION} = MDCExtMultiselectFoundation.cssClasses;
    const {SELECTED_ATTR, ITEM_DATA_RAWDATA_ATTR} = MDCExtMultiselectFoundation.strings;
    if (this.selectEl_ !== undefined) {
      var node = document.createElement('option');
      node.classList.add(SELECTED_OPTION);
      node.setAttribute(SELECTED_ATTR, 'selected');
      if (rawdata)
        node.setAttribute(ITEM_DATA_RAWDATA_ATTR, rawdata);
      node.value = value;
      node.textContent = description;
      this.selectEl_.appendChild(node);
    }
    this.addDisplayOption_(value, description);
  }

  addDisplayOption_(value, description) {
    const {SELECTED_OPTION} = MDCExtMultiselectFoundation.cssClasses;
    const {ITEM_DATA_VALUE_ATTR} = MDCExtMultiselectFoundation.strings;
    if ((this.displayEl_ !== undefined) && (this.input_ !== undefined)) {
      var node = document.createElement('span');
      node.classList.add(SELECTED_OPTION);
      node.setAttribute(ITEM_DATA_VALUE_ATTR, value);
      node.textContent = description;
      this.displayEl_.insertBefore(node, this.input_);
    }
  }

  removeSelectedOption_(index) {
    if ((this.selectEl_ === undefined) || (this.displayEl_ === undefined))
      return;
    if (index < this.selectedOptions.length) {
      this.selectEl_.removeChild(this.selectedOptions[index]);
      this.displayEl_.removeChild(this.displayedOptions[index]);
    }
  }

  updateSelectedOption_(index, value, description, rawdata) {
    const {SELECTED_OPTION} = MDCExtMultiselectFoundation.cssClasses;
    const {SELECTED_ATTR, ITEM_DATA_RAWDATA_ATTR} = MDCExtMultiselectFoundation.strings;
    if ((this.selectEl_ === undefined) || (this.displayEl_ === undefined) ||
      (index >= this.selectedOptions.length))
      return;
    let element = this.selectedOptions[index];
    if (rawdata)
      element.setAttribute(ITEM_DATA_RAWDATA_ATTR, rawdata);
    else
      element.removeAttribute(ITEM_DATA_RAWDATA_ATTR);
    element.value = value;
    element.textContent = description;
    this.updateDisplayOption_(index, value, description);
  }

  updateDisplayOption_(index, value, description) {
    const {SELECTED_OPTION} = MDCExtMultiselectFoundation.cssClasses;
    const {ITEM_DATA_VALUE_ATTR} = MDCExtMultiselectFoundation.strings;
    if (this.displayEl_ == undefined)
      return;
    let element = this.displayedOptions[index];
    element.setAttribute(ITEM_DATA_VALUE_ATTR, value);
    element.textContent = description;
  }

  getActiveItemIndex_() {
    let currentItem = this.activeItem;
    if (!currentItem)
      return undefined;
    let el = currentItem;
    let count = 0;
    while (el = el.previousSibling) {
      if ((el.nodeType == currentItem.nodeType) && (!el.classList.contains(MDCExtMultiselectFoundation.cssClasses.ITEM_NOMATCH)))
        count++;
    }
    return count;
  }
}

export {MDCExtMultiselect, MDCExtMultiselectFoundation,
  MDCExtMultiselectBottomLine, MDCExtMultiselectBottomLineFoundation,
  MDCExtMultiselectLabel, MDCExtMultiselectLabelFoundation};
