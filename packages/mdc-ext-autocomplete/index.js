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

import {MDCComponent} from '@material/base';
import {MDCSimpleMenu} from '@material/menu';
import {MDCTextfield} from '@material/textfield';

import MDCExtAutocompleteFoundation from './foundation';

export {MDCExtAutocompleteFoundation};

export class MDCExtAutocomplete extends MDCComponent {
  static attachTo(root) {
    return new MDCExtAutocomplete(root);
  }

  /** @return {?string} */
  get value() {
    return this.foundation_.getValue();
  }

  /** @param {?string} value */
  set value(value) {
    this.foundation_.setValue(value);
  }

  get items() {
    return this.menu_.items;
  }

  get selectedItems() {
    return this.root_.querySelectorAll('[aria-selected]');
  }

  get selectedIndex() {
    return this.foundation_.getSelectedIndex();
  }

  set selectedIndex(selectedIndex) {
    this.foundation_.setSelectedIndex(selectedIndex);
  }

  get disabled() {
    return this.foundation_.isDisabled();
  }

  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  item(index) {
    return this.items[index] || null;
  }

  namedItem(key) {
    // NOTE: IE11 precludes us from using Array.prototype.find
    for (let i = 0, items = this.items, item; (item = items[i]); i++) {
      if (item.id === key || item.getAttribute('name') === key) {
        return item;
      }
    }
    return null;
  }

  initialize(menuFactory = (el) => new MDCSimpleMenu(el), textFactory = (el) => new MDCTextfield(el)) {
    this.menuEl_ = this.root_.querySelector('.mdc-ext-autocomplete__menu');
    this.menu_ = menuFactory(this.menuEl_);
    this.textEl_ = this.root_.querySelector('.mdc-ext-autocomplete__textfield');
    this.text_ = textFactory(this.textEl_);
  }

  destroy() {
    if (this.menu_) {
      this.menu_.destroy();
    }
    if (this.text_) {
      this.text_.destroy();
    }
    super.destroy();
  }

  getDefaultFoundation() {
    return new MDCExtAutocompleteFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setAttr: (attr, value) => this.root_.setAttribute(attr, value),
      rmAttr: (attr, value) => this.root_.removeAttribute(attr, value),
      computeBoundingRect: () => this.root_.getBoundingClientRect(),
      registerInteractionHandler: (type, handler) => this.root_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.root_.removeEventListener(type, handler),
      focus: () => this.root_.focus(),
      makeTabbable: () => {
        this.root_.tabIndex = 0;
      },
      makeUntabbable: () => {
        this.root_.tabIndex = -1;
      },
      getComputedStyleValue: (prop) => window.getComputedStyle(this.root_).getPropertyValue(prop),
      setStyle: (propertyName, value) => this.root_.style.setProperty(propertyName, value),
      create2dRenderingContext: () => document.createElement('canvas').getContext('2d'),
      setMenuElStyle: (propertyName, value) => this.menuEl_.style.setProperty(propertyName, value),
      setMenuElAttr: (attr, value) => this.menuEl_.setAttribute(attr, value),
      rmMenuElAttr: (attr) => this.menuEl_.removeAttribute(attr),
      getMenuElOffsetHeight: () => this.menuEl_.offsetHeight,
      openMenu: (focusIndex) => this.menu_.show({focusIndex}),
      isMenuOpen: () => this.menu_.open,
      setSelectedTextContent: (selectedTextContent) => {
        this.text_.foundation_.getNativeInput_().value = selectedTextContent;
      },
      getNumberOfItems: () => this.items.length,
      getTextForItemAtIndex: (index) => this.items[index].textContent,
      getValueForItemAtIndex: (index) => this.items[index].id || this.items[index].textContent,
      addClassForItemAtIndex: (index, className) => this.items[index].classList.add(className),
      rmClassForItemAtIndex: (index, className) => this.items[index].classList.remove(className),
      setAttrForItemAtIndex: (index, attr, value) => this.items[index].setAttribute(attr, value),
      rmAttrForItemAtIndex: (index, attr) => this.items[index].removeAttribute(attr),
      getOffsetTopForItemAtIndex: (index) => this.items[index].offsetTop,
      registerMenuInteractionHandler: (type, handler) => this.menu_.listen(type, handler),
      deregisterMenuInteractionHandler: (type, handler) => this.menu_.unlisten(type, handler),
      notifyChange: () => this.emit(MDCExtAutocompleteFoundation.strings.CHANGE_EVENT, this),
      getWindowInnerHeight: () => window.innerHeight,
      getNativeOffsetHeight: () => this.root_.offsetHeight,
      getNativeInput: () => this.text_.foundation_.getNativeInput_()
    });
  }

  initialSyncWithDOM() {
    const selectedItem = this.selectedItems[0];
    const idx = selectedItem ? this.items.indexOf(selectedItem) : -1;
    if (idx >= 0) {
      this.selectedIndex = idx;
    }

    if (this.root_.getAttribute('aria-disabled') === 'true') {
      this.disabled = true;
    }
  }
}
