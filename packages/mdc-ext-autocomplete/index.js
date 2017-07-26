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

  get disabled() {
    return this.foundation_.isDisabled();
  }

  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  get items() {
    return this.listEl_.querySelectorAll('.'+MDCExtAutocompleteFoundation.cssClasses.LIST_ITEM);
  }

  get availableItems() {
    return this.listEl_.querySelectorAll(`.${MDCExtAutocompleteFoundation.cssClasses.LIST_ITEM}:not(.${MDCExtAutocompleteFoundation.cssClasses.ITEM_NOMATCH})`);
  }

  initialize(settings = {}, textFactory = (el) => new MDCTextfield(el)) {
    this.settings_ = settings;
    this.textEl_ = this.root_.querySelector('.' + MDCExtAutocompleteFoundation.cssClasses.TEXTFIELD);
    this.text_ = textFactory(this.textEl_);
    this.listEl_ = this.root_.querySelector('.' + MDCExtAutocompleteFoundation.cssClasses.LIST);
  }

  destroy() {
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
      registerInteractionHandler: (type, handler) => this.root_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.root_.removeEventListener(type, handler),
      hasItemsLoader: () => {
        return ((this.settings_ !== undefined) && (typeof this.settings_.itemsLoader === 'function'));
      },
      applyItemsLoader: (query) => {
        this.applyItemsLoader_(query)
      },
      removeAllItems: () => {
        this.removeAllItems_()
      },
      addItem: (value, description) => {
        this.addItem_(value, description)
      },
      setListElStyle: (propertyName, value) => this.listEl_.style.setProperty(propertyName, value),
      getNumberOfAvailableItems: () => this.availableItems.length,
      getTextForItemAtIndex: (index) => this.items[index].textContent,
      getValueForItemAtIndex: (index) => this.items[index].id || this.items[index].textContent,
      addClassForItemAtIndex: (index, className) => this.items[index].classList.add(className),
      rmClassForItemAtIndex: (index, className) => this.items[index].classList.remove(className),
      setAttrForItemAtIndex: (index, attr, value) => this.items[index].setAttribute(attr, value),
      rmAttrForItemAtIndex: (index, attr) => this.items[index].removeAttribute(attr),
      registerInputInteractionHandler: (type, handler) => this.text_.foundation_.getNativeInput_().addEventListener(type, handler),
      deregisterInputInteractionHandler: (type, handler) => this.text_.foundation_.getNativeInput_().removeEventListener(type, handler),
      getNativeInput: () => this.text_.foundation_.getNativeInput_(),
    });
  }

  applyItemsLoader_(query) {
    var self = this;
    console.log(`quering for: ${query}`);
    this.settings_.itemsLoader.apply(self, [query, function(results) {
            if (results && results.length) {
                    self.foundation_.addItems(results);
                    self.foundation_.refreshItems();
            }
    }]);
  }

  removeAllItems_() {
    if (this.menuItemsEl_ !== undefined) {
      while(this.menuItemsEl_.hasChildNodes()) this.menuItemsEl_.removeChild(this.menuItemsEl_.firstChild);
    }
  }

  addItem_(value, description) {
    const {LIST_ITEM} = MDCExtAutocompleteFoundation.cssClasses;
    if (this.menuItemsEl_ !== undefined) {
      var node = document.createElement('li');
      node.classList.add(LIST_ITEM);
      node.setAttribute('role', 'option');
      node.setAttribute('value', value);
      var textnode = document.createTextNode(description);
      node.appendChild(textnode);
      this.menuItemsEl_.appendChild(node);
    }
  }
}
