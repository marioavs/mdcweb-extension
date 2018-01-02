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
import {cssClasses, strings} from './constants';
import {MDCExtDatePickerAdapter, FoundationMapType} from './adapter';
import MDCExtDatePickerFoundation from './foundation';
import {createFocusTrapInstance} from './util';
/* eslint-disable no-unused-vars */
import {MDCExtDatePickerLabel, MDCExtDatePickerLabelFoundation} from './label';
/* eslint-enable no-unused-vars */

/**
 * @extends {MDCComponent<!MDCExtDatePickerFoundation>}
 * @final
 */
class MDCExtDatePicker extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?Element} */
    this.input_;
    /** @private {?MDCExtDatePickerLabel} */
    this.label_;
    /** @private {?Element} */
    this.surface_;
    /** @private {?Element} */
    this.prevEl_;
    /** @private {?Element} */
    this.nextEl_;
    /** @type {?MDCRipple} */
    this.prevRipple_;
    /** @type {?MDCRipple} */
    this.nextRipple_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCExtDatePicker}
   */
  static attachTo(root) {
    return new MDCExtDatePicker(root);
  }

  /**
   * @param {(function(!Element): !MDCExtDatePickerLabel)=} labelFactory A function which
   * creates a new MDCExtDatePickerLabel.
   * @param {(function(!Element): !MDCRipple)=} rippleFactory A function which
   * creates a new MDCRipple.
   */
  initialize(labelFactory = (el) => new MDCExtDatePickerLabel(el),
    rippleFactory = this.initRipple_) {
    this.input_ = this.root_.querySelector(strings.INPUT_SELECTOR);
    const labelElement = this.root_.querySelector(strings.LABEL_SELECTOR);
    if (labelElement) {
      this.label_ = labelFactory(labelElement);
    }
    this.acceptButton_ = this.root_.querySelector(strings.ACCEPT_SELECTOR);
    this.cancelButton_ = this.root_.querySelector(strings.CANCEL_SELECTOR);
    this.surface_ = this.root_.querySelector(strings.SURFACE_SELECTOR);
    this.focusTrap_ = createFocusTrapInstance(this.surface_, this.acceptButton_);
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
      computeBoundingRect: () => {
        const {left, top} = el.getBoundingClientRect();
        const DIM = 40;
        return {
          top,
          left,
          right: left + DIM,
          bottom: top + DIM,
          width: DIM,
          height: DIM,
        };
      }
    });
    const foundation = new MDCRippleFoundation(adapter);
    return new MDCRipple(el, foundation);
  }

  destroy() {
    if (this.label_)
      this.label_.destroy();
    if (this.prevRipple_)
      this.prevRipple_.destroy();
    if (this.nextRipple_)
      this.nextRipple_.destroy();
    super.destroy();
  }

  /**
   * @return {!MDCExtDatePickerFoundation}
   */
  getDefaultFoundation() {
    return new MDCExtDatePickerFoundation(
      /** @type {!MDCExtDatePickerAdapter} */ (Object.assign({
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        addPrevClass: (className) => this.prevEl_.classList.add(className),
        removePrevClass: (className) => this.prevEl_.classList.remove(className),
        addNextClass: (className) => this.nextEl_.classList.add(className),
        removeNextClass: (className) => this.nextEl_.classList.remove(className),
        hasClass: (className) => this.root_.classList.contains(className),
        hasNecessaryDom: () => Boolean(this.prevEl_) && Boolean(this.nextEl_),
        eventTargetHasClass: (target, className) => target.classList.contains(className),
        registerDatePickerInteractionHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
        deregisterDatePickerInteractionHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
        registerTransitionEndHandler: (handler) => this.surface_.addEventListener('transitionend', handler),
        deregisterTransitionEndHandler: (handler) => this.surface_.removeEventListener('transitionend', handler),
        registerPrevInteractionHandler: (type, handler) => this.prevEl_.addEventListener(type, handler),
        deregisterPrevInteractionHandler: (type, handler) => this.prevEl_.removeEventListener(type, handler),
        registerNextInteractionHandler: (type, handler) => this.nextEl_.addEventListener(type, handler),
        deregisterNextInteractionHandler: (type, handler) => this.nextEl_.removeEventListener(type, handler),
        registerDocumentKeydownHandler: (handler) => document.addEventListener('keydown', handler),
        deregisterDocumentKeydownHandler: (handler) => document.removeEventListener('keydown', handler),
        registerBodyClickHandler: (handler) => document.body.addEventListener('click', handler),
        deregisterBodyClickHandler: (handler) => document.body.removeEventListener('click', handler),
        getTabIndex: () => this.root_.tabIndex,
        setTabIndex: (tabIndex) => this.root_.tabIndex = tabIndex,
        getAttr: (name) => this.root_.getAttribute(name),
        setAttr: (name, value) => this.root_.setAttribute(name, value),
        rmAttr: (name) => this.root_.removeAttribute(name),
        getPrevNativeControl: () => this.prevEl_,
        getNextNativeControl: () => this.nextEl_,
        setPrevAttr: (name, value) => this.prevEl_.setAttribute(name, value),
        rmPrevAttr: (name) => this.prevEl_.removeAttribute(name),
        setNextAttr: (name, value) => this.nextEl_.setAttribute(name, value),
        rmNextAttr: (name) => this.nextEl_.removeAttribute(name),
        isFocused: () => {
          return document.activeElement === this.root_.querySelector(strings.INPUT_SELECTOR);
        },
        isRtl: () => window.getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
        notifyAccept: () => this.emit(strings.ACCEPT_EVENT),
        notifyCancel: () => this.emit(strings.CANCEL_EVENT),
        notifyChange: (evtData) => this.emit(strings.CHANGE_EVENT, {type: evtData.type}),
        isSurface: (el) => el === this.surface_,
        trapFocusOnSurface: () => this.focusTrap_.activate(),
        untrapFocusOnSurface: () => this.focusTrap_.deactivate(),
      },
      this.getInputAdapterMethods_())),
      this.getFoundationMap_());
  }

  /**
   * @return {!{
   *   registerInputInteractionHandler: function(string, function()): undefined,
   *   deregisterInputInteractionHandler: function(string, function()): undefined,
   *   getNativeInput: function(): ?Element,
   * }}
   */
  getInputAdapterMethods_() {
    return {
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
      label: this.label_ ? this.label_.foundation : undefined,
    };
  }

  /**
   * Initiliazes the Date Picker's internal state based on the environment's
   * state.
   */
  initialSyncWithDOM() {
    this.disabled = this.root_.getAttribute(strings.ARIA_DISABLED) === 'true' ||
      this.input_.disabled;
  }

  /**
   * @return {boolean} True if the Date Picker is disabled.
   */
  get disabled() {
    return this.foundation_.isDisabled();
  }

  /**
   * @param {boolean} disabled Sets the Date Picker disabled or enabled.
   */
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }
}

export {MDCExtDatePicker, MDCExtDatePickerFoundation,
  MDCExtDatePickerLabel, MDCExtDatePickerLabelFoundation};
