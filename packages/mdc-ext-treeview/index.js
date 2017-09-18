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
import MDCExtTreeviewFoundation from './foundation';
import {cssClasses, strings} from './constants';
import * as util from './util';

export {MDCExtTreeviewFoundation};

/** @final @extends {MDCComponent<!MDCExtTreeviewFoundation>} */
export class MDCExtTreeview extends MDCComponent {
  static attachTo(root) {
    return new MDCExtTreeview(root);
  }

  initialize() {
  }

  getDefaultFoundation() {
    return new MDCExtTreeviewFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      registerCheckboxChangeHandler: (handler) => this.addCheckboxEventListener_('change', handler),
      deregisterCheckboxChangeHandler: (handler) => this.removeCheckboxEventListener_('change', handler),
      registerToggleChangeHandler: (handler) => this.addToggleEventListener_('change', handler),
      deregisterToggleChangeHandler: (handler) => this.removeToggleEventListener_('change', handler),
      getTabIndex: () => this.root_.tabIndex,
      setTabIndex: (tabIndex) => this.root_.tabIndex = tabIndex,
      getAttr: (name) => this.root_.getAttribute(name),
      setAttr: (name, value) => this.root_.setAttribute(name, value),
      rmAttr: (name) => this.root_.removeAttribute(name),
      setCheckboxDisabled: (disabled, disabledClass) => this.setCheckboxDisabled_(disabled, disabledClass),
      isNodeElement: (element) => element.classList.contains(cssClasses.TREEVIEW_NODE),
      isRowElement: (element) => element.classList.contains(cssClasses.TREEVIEW_ROW),
      getClosest: (element, selectors) => util.getClosest(element, selectors),
      getRowChildren: (rowElement) => this.getRowChildren_(rowElement),
      getRowNativeControl: (rowElement) => rowElement.querySelector(strings.ROW_NATIVE_CONTROL_SELECTOR),
      getTreeArray: () => this.getTreeArray_(),
      setRowState: (rowElement, controlState) => this.setRowState_(rowElement, controlState),
      notifyChange: (evtData) => this.emit(strings.CHANGE_EVENT, {target: evtData.target}),
      notifyToggle: (evtData) => this.emit(strings.TOGGLE_EVENT, {target: evtData.target})
    });
  }

  initialSyncWithDOM() {
    const {
      DATA_CONTROL_STATE_ATTR,
      TRANSITION_STATE_INDETERMINATE,
      TRANSITION_STATE_CHECKED,
      TRANSITION_STATE_UNCHECKED
    } = strings;

    this.disabled = this.root_.getAttribute(strings.ARIA_DISABLED) === 'true';

    let controlState = '';
    let nativeCb = null;
    let elements = this.root_.querySelectorAll(strings.CHECKBOX_SELECTOR);
    for (let i = 0, l = elements.length; i < l; i++) {
      nativeCb = elements[i];
      controlState = nativeCb.getAttribute(DATA_CONTROL_STATE_ATTR);
      if (controlState) {
        if (controlState === TRANSITION_STATE_INDETERMINATE)
          nativeCb.indeterminate = true;
        else {
          nativeCb.indeterminate = false;
          nativeCb.checked = (controlState === TRANSITION_STATE_CHECKED);
        }
      }
    }
    this.resetTreeState();
  }

  /** @return {boolean} */
  get disabled() {
    return this.foundation_.isDisabled();
  }

  /** @param {boolean} isDisabled */
  set disabled(isDisabled) {
    this.foundation_.setDisabled(isDisabled);
  }

  get treeStateArray() {
    return this.foundation_.getTreeStateArray();
  }

  resetTreeState() {
    this.foundation_.resetTreeState();
  }

  addCheckboxEventListener_(type, handler) {
    let elements = this.root_.querySelectorAll(strings.CHECKBOX_SELECTOR);
    for (let i = 0, l = elements.length; i < l; i++) {
      elements[i].addEventListener(type, handler);
    }
  }

  removeCheckboxEventListener_(type, handler) {
    let elements = this.root_.querySelectorAll(strings.CHECKBOX_SELECTOR);
    for (let i = 0, l = elements.length; i < l; i++) {
      elements[i].removeEventListener(type, handler);
    }
  }

  addToggleEventListener_(type, handler) {
    let elements = this.root_.querySelectorAll(strings.TOGGLE_SELECTOR);
    for (let i = 0, l = elements.length; i < l; i++) {
      elements[i].addEventListener(type, handler);
    }
  }

  removeToggleEventListener_(type, handler) {
    let elements = this.root_.querySelectorAll(strings.TOGGLE_SELECTOR);
    for (let i = 0, l = elements.length; i < l; i++) {
      elements[i].removeEventListener(type, handler);
    }
  }

  getRowChildren_(rowElement) {
    const {TREEVIEW_NODE, TREEVIEW_ROW} = cssClasses;

    let result = [];
    let node = null;
    for (let i = 0, l = rowElement.children.length; i < l; i++) {
      if (rowElement.children[i].classList.contains(TREEVIEW_NODE)) {
        node = rowElement.children[i];
        break;
      }
    }
    if (!node)
      return result;
    for (let i = 0, l = node.children.length; i < l; i++) {
      if (node.children[i].classList.contains(TREEVIEW_ROW)) {
        result.push(node.children[i]);
      }
    }
    return result;
  }

  getTreeArray_() {
    const {CHECKBOX_SELECTOR} = strings;

    let treeArray = [];
    let name = '';
    let nativeCb = null;
    let elements = this.root_.querySelectorAll(CHECKBOX_SELECTOR);
    for (let i = 0, l = elements.length; i < l; i++) {
      nativeCb = elements[i];
      name = nativeCb.getAttribute('name') || nativeCb.id;
      if (name) {
        treeArray.push({
          name: name,
          state: this.foundation_.determineCheckState(nativeCb)
        })
      }
    }
    return treeArray;
  }

  setRowState_(rowElement, controlState) {
    const {
      DATA_CONTROL_STATE_ATTR,
      ROW_NATIVE_CONTROL_SELECTOR,
      TRANSITION_STATE_INDETERMINATE,
      TRANSITION_STATE_CHECKED,
      TRANSITION_STATE_UNCHECKED
    } = strings;

    let nativeCb = rowElement.querySelector(ROW_NATIVE_CONTROL_SELECTOR);
    if (!nativeCb)
      return;
    if (controlState === TRANSITION_STATE_INDETERMINATE)
      nativeCb.indeterminate = true;
    else {
      nativeCb.indeterminate = false;
      nativeCb.checked = (controlState === TRANSITION_STATE_CHECKED);
    }
    nativeCb.setAttribute(DATA_CONTROL_STATE_ATTR, controlState);
  }

  setCheckboxDisabled_(disabled, disabledClass) {
    const {CHECKBOX_SELECTOR} = strings;

    let elements = this.root_.querySelectorAll(CHECKBOX_SELECTOR);
    for (let i = 0, l = elements.length; i < l; i++) {
      let el = elements[i];
      el.disabled = disabled;
      if (disabledClass) {
        if (disabled)
          el.classList.add(disabledClass);
        else
          el.classList.remove(disabledClass);
      }
    }
  }
}
