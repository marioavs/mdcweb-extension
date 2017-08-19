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
import {MDCRipple, MDCRippleFoundation, util} from '@material/ripple';
import MDCExtPaginationFoundation from './foundation';
import {cssClasses, strings} from './constants';

export {MDCExtPaginationFoundation};

/** @final @extends {MDCComponent<!MDCExtPaginationFoundation>} */
export class MDCExtPagination extends MDCComponent {
  static attachTo(root) {
    return new MDCExtPagination(root);
  }

  initialize(rippleFactory = this.initRipple_) {
    this.prevEl_ = this.root_.querySelector(strings.PREV_SELECTOR);
    this.nextEl_ = this.root_.querySelector(strings.NEXT_SELECTOR);

    if (this.prevEl_) {
      this.prevRipple_ = rippleFactory(this.prevEl_);
    };
    if (this.nextEl_) {
      this.nextRipple_ = rippleFactory(this.nextEl_);
    };
  }

  /**
   * @param {!Element} el
   * @return {!MDCRipple}
   * @private
   */
  initRipple_(el) {
    const MATCHES = util.getMatchesProperty(HTMLElement.prototype);

    const adapter = Object.assign(MDCRipple.createAdapter(this), {
      isUnbounded: () => true,
      isSurfaceActive: () => el[MATCHES](':active'),
      isSurfaceDisabled: () => el.disabled,
      addClass: (className) => el.classList.add(className),
      removeClass: (className) => el.classList.remove(className),
      registerInteractionHandler: (evtType, handler) =>
        el.addEventListener(evtType, handler, util.applyPassive()),
      deregisterInteractionHandler: (evtType, handler) =>
        el.removeEventListener(evtType, handler, util.applyPassive()),
      updateCssVariable: (varName, value) => el.style.setProperty(varName, value),
      computeBoundingRect: () => el.getBoundingClientRect()
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(el, foundation);
  }

  destroy() {
    if (this.prevRipple_)
      this.prevRipple_.destroy();
    if (this.nextRipple_)
      this.nextRipple_.destroy();
    super.destroy();
  }

  getDefaultFoundation() {
    return new MDCExtPaginationFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      addPrevClass: (className) => this.prevEl_.classList.add(className),
      removePrevClass: (className) => this.prevEl_.classList.remove(className),
      addNetClass: (className) => this.nextEl_.classList.add(className),
      removeNextClass: (className) => this.nextEl_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      hasNecessaryDom: () => Boolean(this.prevEl_) && Boolean(this.nextEl_),
      registerPrevInteractionHandler: (type, handler) => this.prevEl_.addEventListener(type, handler),
      deregisterPrevInteractionHandler: (type, handler) => this.prevEl_.removeEventListener(type, handler),
      registerNextInteractionHandler: (type, handler) => this.nextEl_.addEventListener(type, handler),
      deregisterNextInteractionHandler: (type, handler) => this.nextEl_.removeEventListener(type, handler),
      getTabIndex: () => this.root_.tabIndex,
      setTabIndex: (tabIndex) => this.root_.tabIndex = tabIndex,
      setAttr: (name, value) => this.root_.setAttribute(name, value),
      rmAttr: (name) => this.root_.removeAttribute(name),
      getPrevNativeControl: () => this.prevEl_,
      getNextNativeControl: () => this.nextEl_,
      setPrevAttr: (name, value) => this.prevEl_.setAttribute(name, value),
      rmPrevAttr: (name) => this.prevEl_.removeAttribute(name),
      setNextAttr: (name, value) => this.nextEl_.setAttribute(name, value),
      rmNextAttr: (name) => this.nextEl_.removeAttribute(name),
      notifyChange: (evtData) => this.emit(strings.CHANGE_EVENT, {type: evtData.type})
    });
  }

  initialSyncWithDOM() {
    this.disabled = this.root_.getAttribute(strings.ARIA_DISABLED) === 'true';
  }

  /** @return {boolean} */
  get disabled() {
    return this.foundation_.isDisabled();
  }

  /** @param {boolean} isDisabled */
  set disabled(isDisabled) {
    this.foundation_.setDisabled(isDisabled);
  }

  /** @param {boolean} isDisabled */
  setButtonDisabled(buttonType, isDisabled) {
    this.foundation_.setButtonDisabled(buttonType, isDisabled);
  }
}