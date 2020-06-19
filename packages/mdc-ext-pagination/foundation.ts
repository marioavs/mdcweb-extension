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
import MDCExtPaginationAdapter from './adapter';
import {cssClasses, strings, numbers} from './constants';

/**
 * @final @extends {MDCFoundation<!MDCExtPaginationAdapter>}
 */
export default class MDCExtPaginationFoundation extends MDCFoundation {
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
      addPrevClass: (/* className: string */) => {},
      removePrevClass: (/* className: string */) => {},
      addNextClass: (/* className: string */) => {},
      removeNextClass: (/* className: string */) => {},
      hasClass: (/* className: string */) => /* boolean */ false,
      registerPrevInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterPrevInteractionHandler: (/* type: string, handler: EventListener */) => {},
      registerNextInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterNextInteractionHandler: (/* type: string, handler: EventListener */) => {},
      getTabIndex: () => /* number */ 0,
      setTabIndex: (/* tabIndex: number */) => {},
      getAttr: (/* name: string */) => /* string */ '',
      setAttr: (/* name: string, value: string */) => {},
      rmAttr: (/* name: string */) => {},
      setPrevAttr: (/* name: string, value: string */) => {},
      rmPrevAttr: (/* name: string */) => {},
      setNextAttr: (/* name: string, value: string */) => {},
      rmNextAttr: (/* name: string */) => {},
      getFirstContent: () => {},
      setFirstContent: (/* value: string */) => {},
      getLastContent: () => {},
      setLastContent: (/* value: string */) => {},
      getTotalContent: () => {},
      setTotalContent: (/* value: string */) => {},
      notifyChange: (/* evtData: {type: string} */) => {}
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCExtPaginationFoundation.defaultAdapter, adapter));

    /** @private {boolean} */
    this.disabled_ = false;

    /** @private {number} */
    this.savedTabIndex_ = -1;

    /** @private {number} */
    this.pageSize_ = 0;

    /** @private {number} */
    this.first_ = 0;

    /** @private {number} */
    this.last_ = 0;

    /** @private {number} */
    this.total_ = 0;

    this.prevClickHandler_ = /** @private {!EventListener} */ (() => {
      if (!this.disabled_)
        this.adapter_.notifyChange({type: strings.TYPE_PREV});
    });

    this.nextClickHandler_ = /** @private {!EventListener} */ (() => {
      if (!this.disabled_)
        this.adapter_.notifyChange({type: strings.TYPE_NEXT});
    });
  }

  init() {
    const {ROOT, UPGRADED} = cssClasses;
    const {DATA_PAGE_SIZE} = strings;

    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (!this.adapter_.hasNecessaryDom()) {
      throw new Error(`Required DOM nodes missing in ${ROOT} component.`);
    }

    let pageSizeAttr = this.adapter_.getAttr(DATA_PAGE_SIZE);
    if (pageSizeAttr) {
      this.pageSize_ = +pageSizeAttr;
    }

    this.adapter_.addClass(UPGRADED);
    this.adapter_.registerPrevInteractionHandler('click', this.prevClickHandler_);
    this.adapter_.registerNextInteractionHandler('click', this.nextClickHandler_);
  }

  destroy() {
    const {UPGRADED} = cssClasses;

    this.adapter_.removeClass(UPGRADED);
    this.adapter_.deregisterPrevInteractionHandler('click', this.prevClickHandler_);
    this.adapter_.deregisterNextInteractionHandler('click', this.nextClickHandler_);
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
  }

  /**
   * @param {string} buttonType
   * @param {boolean} isDisabled
   */
  setButtonDisabled(buttonType, isDisabled) {
    const {BUTTON_DISABLED} = cssClasses;
    const {ARIA_DISABLED, TYPE_NEXT, TYPE_PREV} = strings;
    let nativeControl = {};
    if (buttonType === TYPE_PREV)
      nativeControl = this.adapter_.getPrevNativeControl();
    else if (buttonType === TYPE_NEXT)
      nativeControl = this.adapter_.getNextNativeControl();
    if (nativeControl)
      nativeControl.disabled = isDisabled;

    if (isDisabled) {
      if (buttonType === TYPE_PREV) {
        this.adapter_.setPrevAttr(ARIA_DISABLED, 'true');
        this.adapter_.addPrevClass(BUTTON_DISABLED);
      }
      else if (buttonType === TYPE_NEXT) {
        this.adapter_.setNextAttr(ARIA_DISABLED, 'true');
        this.adapter_.addNextClass(BUTTON_DISABLED);
      }
    } else {
      if (buttonType === TYPE_PREV) {
        this.adapter_.rmPrevAttr(ARIA_DISABLED);
        this.adapter_.removePrevClass(BUTTON_DISABLED);
      }
      else if (buttonType === TYPE_NEXT) {
        this.adapter_.rmNextAttr(ARIA_DISABLED);
        this.adapter_.removeNextClass(BUTTON_DISABLED);
      }
    }
  }

  /** @return {boolean} */
  getPageSize() {
    return this.pageSize_;
  }

  /** @param {number} value */
  setPageSize(value) {
    const {TYPE_NEXT, TYPE_PREV} = strings;
    this.pageSize_ = value;
    if (value > 0) {
      this.last_ = Math.min(this.first_ + value - 1, this.total_);
      this.adapter_.setLastContent(this.last_.toString());
      this.setButtonDisabled(TYPE_NEXT, (this.last_ >= this.total_));
    }
  }

  /** @return {boolean} */
  getFirst() {
    return this.first_;
  }

  /** @param {number} value */
  setFirst(value) {
    const {TYPE_NEXT, TYPE_PREV} = strings;
    this.first_ = value;
    this.adapter_.setFirstContent(value.toString());
    this.setButtonDisabled(TYPE_PREV, (value <= 1));
    if (this.pageSize_ > 0) {
      this.last_ = Math.min(value + this.pageSize_ - 1, this.total_);
      this.adapter_.setLastContent(this.last_.toString());
      this.setButtonDisabled(TYPE_NEXT, (this.last_ >= this.total_));
    }
  }

  /** @return {boolean} */
  getLast() {
    return this.last_;
  }

  /** @param {number} value */
  setLast(value) {
    const {TYPE_NEXT} = strings;
    this.last_ = value;
    this.adapter_.setLastContent(value.toString());
    this.setButtonDisabled(TYPE_NEXT, (value >= this.total_));
  }

  /** @return {boolean} */
  getTotal() {
    return this.total_;
  }

  /** @param {number} value */
  setTotal(value) {
    const {TYPE_NEXT} = strings;
    this.total_ = value;
    this.adapter_.setTotalContent(value.toString());
    this.setButtonDisabled(TYPE_NEXT, (this.last_ >= value));
  }
}
