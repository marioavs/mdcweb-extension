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
    return this.listUl_.querySelectorAll('.'+MDCExtAutocompleteFoundation.cssClasses.LIST_ITEM);
  }

  get availableItems() {
    return this.listUl_.querySelectorAll(`.${MDCExtAutocompleteFoundation.cssClasses.LIST_ITEM}:not(.${MDCExtAutocompleteFoundation.cssClasses.ITEM_NOMATCH})`);
  }

  get firstAvailableItem() {
    if (this.availableItems.length > 0)
      return this.availableItems[0];
    return null;
  }

  get selectedItem() {
    return this.listUl_.querySelector(`[${MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR}]`);
  }

  get selectedItems() {
    return this.listUl_.querySelectorAll(`[${MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR}]`);
  }

  initialize(settings = {}, textFactory = (el) => new MDCTextfield(el)) {
    this.settings_ = settings;
    this.textEl_ = this.root_.querySelector('.' + MDCExtAutocompleteFoundation.cssClasses.TEXTFIELD);
    this.text_ = textFactory(this.textEl_);
    this.listEl_ = this.root_.querySelector('.' + MDCExtAutocompleteFoundation.cssClasses.LIST);
    this.listUl_ = this.listEl_.querySelector('ul');
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
      registerInputInteractionHandler: (type, handler) => this.text_.foundation_.getNativeInput_().addEventListener(type, handler),
      deregisterInputInteractionHandler: (type, handler) => this.text_.foundation_.getNativeInput_().removeEventListener(type, handler),
      registerListInteractionHandler: (type, handler) => this.listUl_.addEventListener(type, handler),
      deregisterListInteractionHandler: (type, handler) => this.listUl_.removeEventListener(type, handler),
      focus: () => this.textEl_.focus(),
      hasItemsLoader: () => {
        return ((this.settings_ !== undefined) && (typeof this.settings_.itemsLoader === 'function'));
      },
      applyItemsLoader: (query) => {
        this.applyItemsLoader_(query)
      },
      removeAllItems: () => {
        this.removeAllItems_()
      },
      addItem: (data) => {
        this.addItem_(data)
      },
      setListElStyle: (propertyName, value) => this.listEl_.style.setProperty(propertyName, value),
      getNumberOfItems: () => this.items.length,
      getNumberOfAvailableItems: () => this.availableItems.length,
      getSelectedItem: () => this.selectedItem,
      getSelectedItemValue: () => this.selectedItem.getAttribute(MDCExtAutocompleteFoundation.strings.ITEM_DATA_VALUE_ATTR),
      getSelectedItemDescription: () => {
        return this.selectedItem.getAttribute(MDCExtAutocompleteFoundation.strings.ITEM_DATA_DESC_ATTR) || this.selectedItem.textContent
      },
      selectCurrentAvailableItem: () => {
        let currentItem = this.selectedItem;
        if (currentItem) {
          if (!currentItem.classList.contains(MDCExtAutocompleteFoundation.cssClasses.ITEM_NOMATCH))
            return;
          currentItem.removeAttribute(MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR);
        }
        currentItem = this.firstAvailableItem;
        if (currentItem != null)
          currentItem.setAttribute(MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR,'true');
        return;
      },
      selectPreviousAvailableItem: () => {
        let currentItem = this.selectedItem;
        if (currentItem == null) {
          currentItem = this.firstAvailableItem;
          if (currentItem != null)
            currentItem.setAttribute(MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR,'true');
          return;
        }
        currentItem.removeAttribute(MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR);
        let el = currentItem.previousSibling;
        while (el) {
          if ((el.nodeType == currentItem.nodeType) && (!el.classList.contains(MDCExtAutocompleteFoundation.cssClasses.ITEM_NOMATCH))) {
            el.setAttribute(MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR,'true');
            return;
          }
          el = el.previousSibling;
        }
        currentItem = this.firstAvailableItem;
        if (currentItem != null)
          currentItem.setAttribute(MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR,'true');
      },
      selectNextAvailableItem: () => {
        let currentItem = this.selectedItem;
        if (currentItem == null) {
          currentItem = this.firstAvailableItem;
          if (currentItem != null)
            currentItem.setAttribute(MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR,'true');
          return;
        }
        currentItem.removeAttribute(MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR);
        let el = currentItem.nextSibling;
        while (el) {
          if ((el.nodeType == currentItem.nodeType) && (!el.classList.contains(MDCExtAutocompleteFoundation.cssClasses.ITEM_NOMATCH))) {
            el.setAttribute(MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR,'true');
            return;
          }
          el = el.nextSibling;
        }
        currentItem.setAttribute(MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR,'true');
      },
      setSelectedItem: (item) => {
        let allSelectedItems = this.selectedItems;
        for (let i = 0, l = allSelectedItems.length; i < l; i++) {
          allSelectedItems[i].removeAttribute(MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR);
        }
        if (item != null) {
          item.setAttribute(MDCExtAutocompleteFoundation.strings.ARIA_SELECTED_ATTR,'true');
        }
      },
      getTextForItemAtIndex: (index) => this.items[index].textContent,
      getValueForItemAtIndex: (index) => this.items[index].id || this.items[index].textContent,
      addClassForItemAtIndex: (index, className) => this.items[index].classList.add(className),
      rmClassForItemAtIndex: (index, className) => this.items[index].classList.remove(className),
      setAttrForItemAtIndex: (index, attr, value) => this.items[index].setAttribute(attr, value),
      rmAttrForItemAtIndex: (index, attr) => this.items[index].removeAttribute(attr),
      notifyChange: () => this.emit(MDCExtAutocompleteFoundation.strings.CHANGE_EVENT, this),
      getNativeElement: () => this.root_,
      getNativeInput: () => this.text_.foundation_.getNativeInput_()
    });
  }

  applyItemsLoader_(query) {
    this.setJsonAttributes();
    var self = this;
    this.settings_.itemsLoader.apply(self, [query, function(results) {
            if (results && results.length) {
                    self.foundation_.addItems(results);
                    self.foundation_.refreshItems();
            }
    }]);
  }

  setJsonAttributes(){
    if (this.settings_.itemValueProperty !== undefined){
      this.foundation_.setValueProperty(this.settings_.itemValueProperty);
    }
    if (this.settings_.itemDescriptionProperty !== undefined){
      this.foundation_.setDescriptionProperty(this.settings_.itemDescriptionProperty);
    }
  }

  removeAllItems_() {
    if (this.listUl_ !== undefined) {
      while(this.listUl_.hasChildNodes()) this.listUl_.removeChild(this.listUl_.firstChild);
    }
  }

  addItem_(data) {
    let value = data[this.foundation_.getValueProperty()];
    let description = data[this.foundation_.getDescriptionProperty()];
    const {LIST_ITEM} = MDCExtAutocompleteFoundation.cssClasses;
    const {ITEM_DATA_VALUE_ATTR, ITEM_DATA_DESC_ATTR} = MDCExtAutocompleteFoundation.strings;
    if (this.listUl_ !== undefined) {
      var node = document.createElement('li');
      node.classList.add(LIST_ITEM);
      node.setAttribute('role', 'option');
      node.setAttribute(ITEM_DATA_VALUE_ATTR, value);
      node.setAttribute(ITEM_DATA_DESC_ATTR, description);
      var textnode = document.createTextNode(description);
      node.appendChild(textnode);
      this.listUl_.appendChild(node);
    }
  }
}
