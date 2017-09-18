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
import MDCExtTreeviewAdapter from './adapter';
import {cssClasses, strings, numbers} from './constants';

/**
 * @final @extends {MDCFoundation<!MDCExtTreeviewAdapter>}
 */
export default class MDCExtTreeviewFoundation extends MDCFoundation {
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
      hasClass: (/* className: string */) => /* boolean */ false,
      registerCheckboxChangeHandler: (/* handler: EventListener */) => {},
      deregisterCheckboxChangeHandler: (/* handler: EventListener */) => {},
      registerToggleChangeHandler: (/* handler: EventListener */) => {},
      deregisterToggleChangeHandler: (/* handler: EventListener */) => {},
      getTabIndex: () => /* number */ 0,
      setTabIndex: (/* tabIndex: number */) => {},
      getAttr: (/* name: string */) => /* string */ '',
      setAttr: (/* name: string, value: string */) => {},
      rmAttr: (/* name: string */) => {},
      notifyChange: (/* evtData: {target: !Element} */) => {},
      notifyToggle: (/* evtData: {target: !Element} */) => {}
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCExtTreeviewFoundation.defaultAdapter, adapter));

    this.treeState_ = {};

    /** @private {boolean} */
    this.disabled_ = false;

    /** @private {number} */
    this.savedTabIndex_ = -1;

    /** @private {boolean} */
    this.updating_ = false;

    this.checkboxChangeHandler_ = /** @private {!EventListener} */ (
      (event) => this.transitionCheckState_(event));

    this.toggleChangeHandler_ = /** @private {!EventListener} */ ((event) => {
      this.adapter_.notifyToggle({target: event.target});
    });
  }

  init() {
    const {ROOT, UPGRADED} = cssClasses;

    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    this.adapter_.addClass(UPGRADED);
    this.adapter_.registerCheckboxChangeHandler(this.checkboxChangeHandler_);
    this.adapter_.registerToggleChangeHandler(this.toggleChangeHandler_);
  }

  destroy() {
    const {UPGRADED} = cssClasses;

    this.adapter_.removeClass(UPGRADED);
    this.adapter_.deregisterCheckboxChangeHandler(this.checkboxChangeHandler_);
    this.adapter_.deregisterToggleChangeHandler(this.toggleChangeHandler_);
  }

  /** @return {boolean} */
  isDisabled() {
    return this.disabled_;
  }

  /** @param {boolean} isDisabled */
  setDisabled(isDisabled) {
    this.disabled_ = isDisabled;

    const {DISABLED} = cssClasses;
    const {ARIA_DISABLED} = strings;

    if (this.disabled_) {
      this.savedTabIndex_ = this.adapter_.getTabIndex();
      this.adapter_.setTabIndex(-1);
      this.adapter_.setAttr(ARIA_DISABLED, 'true');
      this.adapter_.addClass(DISABLED);
    } else {
      this.adapter_.setTabIndex(this.savedTabIndex_);
      this.adapter_.rmAttr(ARIA_DISABLED);
      this.adapter_.removeClass(DISABLED);
    }
    this.adapter_.setCheckboxDisabled(isDisabled, DISABLED);
  }

  getTreeStateArray() {
    let treeStateArray = [];
    let name = '';
    let treeArray = this.adapter_.getTreeArray();
    for (let i = 0, l = treeArray.length; i < l; i++) {
      name = treeArray[i]['name'];
      treeStateArray.push({
        name: name,
        state: treeArray[i]['state'],
        previousState: this.treeState_[name]['state']
      });
    }
    return treeStateArray;
  }

  determineCheckState(nativeCb) {
    return this.determineCheckState_(nativeCb);
  }

  resetTreeState() {
    this.treeState_ = {};
    let treeArray = this.adapter_.getTreeArray();
    for (let i = 0, l = treeArray.length; i < l; i++) {
      this.treeState_[treeArray[i]['name']] = {
        state: treeArray[i]['state']
      }
    }
  }

  determineCheckState_(nativeCb) {
    const {
      TRANSITION_STATE_INDETERMINATE,
      TRANSITION_STATE_CHECKED,
      TRANSITION_STATE_UNCHECKED,
    } = strings;

    if (nativeCb.indeterminate) {
      return TRANSITION_STATE_INDETERMINATE;
    }
    return nativeCb.checked ? TRANSITION_STATE_CHECKED : TRANSITION_STATE_UNCHECKED;
  }

  transitionCheckState_(event) {
    const {ROW_SELECTOR} = strings;

    this.updating_ = true;
    let nativeCb = event.target;
    let controlState = this.determineCheckState_(nativeCb);
    let source = this.adapter_.getClosest(nativeCb, ROW_SELECTOR);
    this.updateChildren_(source, controlState);
    this.updateParent_(source.parentElement);
    this.adapter_.notifyChange({target: nativeCb});
    this.updating_ = false;
  }

  updateChildren_(element, controlState) {
    if (!element)
      return;
    let children = this.adapter_.getRowChildren(element);
    if (!children)
      return;
    for (let i = 0, l = children.length; i < l; i++) {
      this.adapter_.setRowState(children[i], controlState);
      this.updateChildren_(children[i], controlState);
    }
  }

  updateParent_(element) {
    const {
      TRANSITION_STATE_INDETERMINATE,
      TRANSITION_STATE_CHECKED,
      TRANSITION_STATE_UNCHECKED,
    } = strings;

    if ((!element) || (!this.adapter_.isNodeElement(element)))
      return;
    let children = this.adapter_.getRowChildren(element.parentElement);
    if (!children)
      return;
    let parent = element.parentElement;
    if ((!parent) || (!this.adapter_.isRowElement(parent)))
      return;
    let nativeCb = null;
    let controlState = '';
    let states = {};
    states[TRANSITION_STATE_INDETERMINATE] = 0;
    states[TRANSITION_STATE_CHECKED] = 0;
    states[TRANSITION_STATE_UNCHECKED] = 0;
    for (let i = 0, l = children.length; i < l; i++) {
      nativeCb = this.getRowNativeControl_(children[i]);
      controlState = this.determineCheckState_(nativeCb);
      states[controlState]++;
    }
    controlState = TRANSITION_STATE_INDETERMINATE;
    if ((!states[TRANSITION_STATE_INDETERMINATE]) && (!states[TRANSITION_STATE_UNCHECKED]))
      controlState = TRANSITION_STATE_CHECKED;
    else if ((!states[TRANSITION_STATE_INDETERMINATE]) && (!states[TRANSITION_STATE_CHECKED]))
      controlState =  TRANSITION_STATE_UNCHECKED;

    this.adapter_.setRowState(parent, controlState);
    this.updateParent_(parent.parentElement);
  }

  getRowNativeControl_(element) {
    return this.adapter_.getRowNativeControl(element) || {
      checked: false,
      indeterminate: false,
      disabled: false,
      value: null,
    };
  }
}
