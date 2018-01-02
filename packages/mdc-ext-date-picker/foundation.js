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
import MDCExtDatePickerAdapter from './adapter';
import {cssClasses, strings} from './constants';
/* eslint-disable no-unused-vars */
import MDCExtDatePickerLabelFoundation from './label/foundation';
/* eslint-enable no-unused-vars */

/**
 * @extends {MDCFoundation<!MDCExtDatePickerAdapter>}
 * @final
 */
export default class MDCExtDatePickerFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /**
   * {@see MDCExtDatePickerAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCExtDatePickerAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCExtDatePickerAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      addPrevClass: () => {},
      removePrevClass: () => {},
      addNextClass: () => {},
      removeNextClass: () => {},
      hasClass: () => false,
      hasNecessaryDom: () => false,
      eventTargetHasClass: () => false,
      registerDatePickerInteractionHandler: () => {},
      deregisterDatePickerInteractionHandler: () => {},
      registerTransitionEndHandler: () => {},
      deregisterTransitionEndHandler: () => {},
      registerPrevInteractionHandler: () => {},
      deregisterPrevInteractionHandler: () => {},
      registerNextInteractionHandler: () => {},
      deregisterNextInteractionHandler: () => {},
      registerDocumentKeydownHandler: () => {},
      deregisterDocumentKeydownHandler: () => {},
      registerBodyClickHandler: () => {},
      deregisterBodyClickHandler: () => {},
      getTabIndex: () => 0,
      setTabIndex: () => {},
      getAttr: () => '',
      setAttr: () => {},
      rmAttr: () => {},
      getPrevNativeControl: () => {},
      getNextNativeControl: () => {},
      setPrevAttr: () => {},
      rmPrevAttr: () => {},
      setNextAttr: () => {},
      rmNextAttr: () => {},
      isFocused: () => {},
      isRtl: () => {},
      notifyAccept: () => {},
      notifyCancel: () => {},
      isSurface: () => {},
      trapFocusOnSurface: () => {},
      untrapFocusOnSurface: () => {},
    });
  }

  /**
   * @param {!MDCExtDatePickerAdapter=} adapter
   * @param {!FoundationMapType=} foundationMap Map from subcomponent names to their subfoundations.
   */
  constructor(adapter = /** @type {!MDCExtDatePickerAdapter} */ ({}),
    foundationMap = /** @type {!FoundationMapType} */ ({})) {
    super(Object.assign(MDCExtDatePickerFoundation.defaultAdapter, adapter));

    /** @type {!MDCExtDatePickerLabelFoundation|undefined} */
    this.label_ = foundationMap.label;

    /** @private {boolean} */
    this.disabled_ = false;
    /** @private {boolean} */
    this.isFocused_ = false;
    /** @private {boolean} */
    this.isOpen_ = false;
    /** @private {number} */
    this.startScaleX_ = 0;
    /** @private {number} */
    this.startScaleY_ = 0;
    /** @private {number} */
    this.targetScale_ = 1;
    /** @private {number} */
    this.scaleX_ = 0;
    /** @private {number} */
    this.scaleY_ = 0;
    /** @private {boolean} */
    this.running_ = false;
    /** @private {number} */
    this.animationRequestId_ = 0;
    /** @private {!{ width: number, height: number }} */
    this.dimensions_;
    /** @private {number} */
    this.startTime_;
    /** @private {function(): undefined} */
    this.inputFocusHandler_ = () => this.activateFocus();
    /** @private {function(): undefined} */
    this.inputBlurHandler_ = () => this.deactivateFocus();
    /** @private {function(): undefined} */
    this.inputInputHandler_ = () => this.autoCompleteFocus();
    /** @private {function(!Event): undefined} */
    this.datePickerInteractionHandler_ = (evt) => this.handleDatePickerInteraction(evt);
    /** @private {function(!Event)} */
    this.bodyClickHandler_ = (evt) => this.handleBodyClick_(evt);
    /** @private {function(!Event): undefined} */
    this.documentKeydownHandler_ = (evt) => this.handleDocumentKeydown_(evt);
    /** @private {function(!Event): undefined} */
    this.transitionEndHandler_ = (evt) => this.handleTransitionEnd_(evt);
    /** @private {function(!Event): undefined} */
    this.surfaceHandler_ = (evt) => this.handleDatePickerSurface(evt);

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
    const {ROOT, OPEN, UPGRADED} = cssClasses;
    const {DATA_PAGE_SIZE} = strings;

    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (!this.adapter_.hasNecessaryDom()) {
      throw new Error(`Required DOM nodes missing in ${ROOT} component.`);
    }

    this.adapter_.addClass(UPGRADED);
    // Ensure label does not collide with any pre-filled value.
    if (this.getNativeInput_().value && this.label_) {
      this.label_.floatAbove();
    }

    if (this.adapter_.hasClass(OPEN)) {
      this.isOpen_ = true;
    }

    if (this.adapter_.isFocused()) {
      this.inputFocusHandler_();
    }

    this.adapter_.registerInputInteractionHandler('focus', this.inputFocusHandler_);
    this.adapter_.registerInputInteractionHandler('blur', this.inputBlurHandler_);
    this.adapter_.registerInputInteractionHandler('input', this.inputInputHandler_);
    ['click', 'keydown'].forEach((evtType) => {
      this.adapter_.registerDatePickerInteractionHandler(evtType, this.datePickerInteractionHandler_);
    });
    this.adapter_.registerPrevInteractionHandler('click', this.prevClickHandler_);
    this.adapter_.registerNextInteractionHandler('click', this.nextClickHandler_);
  }

  destroy() {
    const {UPGRADED} = cssClasses;

    this.adapter_.removeClass(UPGRADED);
    this.adapter_.registerInputInteractionHandler('focus', this.inputFocusHandler_);
    this.adapter_.registerInputInteractionHandler('blur', this.inputBlurHandler_);
    this.adapter_.registerInputInteractionHandler('input', this.inputInputHandler_);
    ['click', 'keydown'].forEach((evtType) => {
      this.adapter_.deregisterDatePickerInteractionHandler(evtType, this.datePickerInteractionHandler_);
    });
    this.adapter_.deregisterPrevInteractionHandler('click', this.prevClickHandler_);
    this.adapter_.deregisterNextInteractionHandler('click', this.nextClickHandler_);
    if (this.isOpen_) {
      this.adapter_.deregisterBodyClickHandler(this.bodyClickHandler_);
      this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
    }
  }

  /**
   * Handles user interactions with the Date Picker.
   * @param {!Event} evt
   */
  handleDatePickerInteraction(evt) {
    if (this.adapter_.getNativeInput().disabled) {
      return;
    }
    this.surfaceHandler_(evt)
    this.receivedUserInput_ = true;
  }

  handleDatePickerSurface(evt) {
    evt.preventDefault();
    // evt.stopPropagation();
    if (!this.isOpen()) {
      this.open_();
    }
  }

  /**
   * Activates the text field focus state.
   */
  activateFocus() {
    const {FOCUSED} = cssClasses;
    this.adapter_.addClass(FOCUSED);
    if (this.label_) {
      this.label_.floatAbove();
    }
    this.isFocused_ = true;
  }

  /**
   * Activates the Date Picker's focus state in cases when the input value
   * changes without user input (e.g. programatically).
   */
  autoCompleteFocus() {
    if (!this.receivedUserInput_) {
      this.activateFocus();
    }
  }

  /**
   * Deactives the Date Picker's focus state.
   */
  deactivateFocus() {
    const {FOCUSED} = cssClasses;
    const input = this.getNativeInput_();
    const shouldRemoveLabelFloat = !input.value && !this.isBadInput_();

    this.isFocused_ = false;
    this.adapter_.removeClass(FOCUSED);
    if (this.label_) {
      this.label_.deactivateFocus(shouldRemoveLabelFloat);
    }
    if (shouldRemoveLabelFloat) {
      this.receivedUserInput_ = false;
    }
  }

  /**
   * Updates the Date Picker's valid state based on the supplied validity.
   * @param {boolean} isValid
   * @private
   */
  changeValidity_(isValid) {
    const {INVALID} = cssClasses;
    if (isValid) {
      this.adapter_.removeClass(INVALID);
    } else {
      this.adapter_.addClass(INVALID);
    }
    if (this.helperText_) {
      this.helperText_.setValidity(isValid);
    }
    if (this.label_) {
      this.label_.setValidity(isValid);
    }
  }

  /**
   * @return {boolean} True if the Date Picker input fails validity checks.
   * @private
   */
  isBadInput_() {
    const input = this.getNativeInput_();
    return input.validity ? input.validity.badInput : input.badInput;
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

  /**
   * @return {!Element|!NativeInputType} The native text input from the
   * host environment, or a dummy if none exists.
   * @private
   */
  getNativeInput_() {
    return this.adapter_.getNativeInput() ||
    /** @type {!NativeInputType} */ ({
      checkValidity: () => true,
      value: '',
      disabled: false,
      badInput: false,
    });
  }

  /**
   * @param {boolean} isValid Sets the validity state of the Date Picker.
   */
  setValid(isValid) {
    this.useCustomValidityChecking_ = true;
    this.changeValidity_(isValid);
  }

  /**
   * Handle clicks and cancel the component if not a children
   * @param {!Event} evt
   * @private
   */
  handleBodyClick_(evt) {
    let el = evt.target;

    while (el && el !== document.documentElement) {
      if (this.adapter_.eventTargetHasClass(el, cssClasses.ROOT)) {
        return;
      }
      el = el.parentNode;
    }
    this.adapter_.notifyCancel();
    this.close_();
  };

  /**
   * Handle key down and cancel the component if needed
   * @param {!Event} evt
   * @private
   */
  handleDocumentKeydown_(evt) {
    if (evt.key && evt.key === 'Escape' || evt.keyCode === 27) {
      this.cancel(true);
    }
  };

  open_() {
    const {ANIMATING, OPEN} = cssClasses;
    this.adapter_.registerDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.registerBodyClickHandler(this.bodyClickHandler_);
    // this.adapter_.registerInteractionHandler('click', this.componentClickHandler_);
    // this.adapter_.registerBodyClickHandler(this.documentClickHandler_);
    this.adapter_.addClass(ANIMATING);
    this.adapter_.addClass(OPEN);
    this.isOpen_ = true;
    this.adapter_.registerTransitionEndHandler(this.transitionEndHandler_);
  }

  close_() {
    const {ANIMATING, OPEN} = cssClasses;
    this.adapter_.deregisterDocumentKeydownHandler(this.documentKeydownHandler_);
    // this.adapter_.deregisterInteractionHandler('click', this.componentClickHandler_);
    // this.adapter_.deregisterBodyClickHandler(this.documentClickHandler_);
    this.adapter_.untrapFocusOnSurface();
    this.adapter_.registerTransitionEndHandler(this.transitionEndHandler_);
    this.adapter_.addClass(ANIMATING);
    this.adapter_.removeClass(OPEN);
    this.isOpen_ = false;
  }

  handleTransitionEnd_(evt) {
    if (this.adapter_.isSurface(evt.target)) {
      this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
      this.adapter_.removeClass(cssClasses.ANIMATING);
      if (this.isOpen_) {
        this.adapter_.trapFocusOnSurface();
      };
    };
  };

  /** @return {boolean} */
  isOpen() {
    return this.isOpen_;
  }

  accept(shouldNotify) {
    if (shouldNotify) {
      this.adapter_.notifyAccept();
    }

    this.close_();
  }

  cancel(shouldNotify) {
    if (shouldNotify) {
      this.adapter_.notifyCancel();
    }

    this.close_();
  }
}
