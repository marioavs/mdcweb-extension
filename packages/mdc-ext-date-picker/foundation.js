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

import {cssClasses, strings} from './constants';
import {getCorrectPropertyName} from '@material/animation';
import MDCFoundation from '@material/base/foundation';
import MDCExtDatePickerAdapter from './adapter';
/* eslint-disable no-unused-vars */
import MDCExtDatePickerLabelFoundation from './label/foundation';
/* eslint-enable no-unused-vars */

const OPENER_KEYS = [
  {key: 'ArrowUp', keyCode: 38, forType: 'keydown'},
  {key: 'ArrowDown', keyCode: 40, forType: 'keydown'},
  {key: 'Space', keyCode: 32, forType: 'keyup'},
];

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
      addDayClassAndFocus: () => {},
      removeAllDaysClass: () => {},
      addYearClass: () => {},
      removeYearClass: () => {},
      addYearListClass: () => {},
      removeYearListClass: () => {},
      hasClass: () => false,
      hasNecessaryDom: () => false,
      eventTargetInDatePicker: () => false,
      eventTargetInSurface: () => false,
      eventTargetHasClass: () => false,
      eventTargetDateAttr: () => {},
      getDayTableDimensions: () => {},
      registerDatePickerInteractionHandler: () => {},
      deregisterDatePickerInteractionHandler: () => {},
      registerTransitionEndHandler: () => {},
      deregisterTransitionEndHandler: () => {},
      registerDocumentKeydownHandler: () => {},
      deregisterDocumentKeydownHandler: () => {},
      registerSurfaceInteractionHandler: () => {},
      deregisterSurfaceInteractionHandler: () => {},
      registerDocumentClickHandler: () => {},
      deregisterDocumentClickHandler: () => {},
      registerDayClickHandler: () => {},
      deregisterDayClickHandler: () => {},
      registerTableTransitionEndHandler: () => {},
      deregisterTableTransitionEndHandler: () => {},
      registerYearTransitionEndHandler: () => {},
      deregisterYearTransitionEndHandler: () => {},
      setYearListStyleProperty: () => {},
      setupDayTables: () => {},
      replaceTableBody: () => {},
      replaceTableClass: () => {},
      setDateContent: () => {},
      setMonthContent: () => {},
      setMonthFocus: () => {},
      setWeekDayContent: () => {},
      setYearContent: () => {},
      setupYearList: () => {},
      setFirstYear: () => {},
      getYearListOffsetHeight: () => {},
      getYearOffsetHeight: () => {},
      getYearSelectionClientHeight: () => {},
      getTabIndex: () => 0,
      setTabIndex: () => {},
      getAttr: () => '',
      setAttr: () => {},
      rmAttr: () => {},
      setMonthsHeight: () => {},
      setMonthsWidth: () => {},
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

    this.settings_ = this.getDefaultSettings_();

    /** @type {!MDCExtDatePickerLabelFoundation|undefined} */
    this.label_ = foundationMap.label;

    this.value_ = null;
    this.selectedValue_ = null;
    this.displayValue_ = null;
    this.displayYear_ = null;
    /** @private {boolean} */
    this.isFocused_ = false;
    /** @private {boolean} */
    this.isOpen_ = false;
    /** @private {boolean} */
    this.useCustomValidityChecking_ = false;
    /** @private {boolean} */
    this.isValid_ = true;
    /** @private {boolean} */
    this.animatingYear_ = false;
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
    this.defaultValueToString_ = () => this.valueToString_();
    /** @private {function(): undefined} */
    this.inputFocusHandler_ = () => this.activateFocus();
    /** @private {function(): undefined} */
    this.inputBlurHandler_ = () => this.deactivateFocus();
    /** @private {function(): undefined} */
    this.inputInputHandler_ = () => this.autoCompleteFocus();
    /** @private {function(!Event): undefined} */
    this.datePickerInteractionHandler_ = (evt) => this.handleDatePickerInteraction(evt);
    /** @private {function(!Event)} */
    this.bodyClickHandler_ = (evt) => this.handleDocumentClick_(evt);
    /** @private {function(!Event)} */
    this.dayClickHandler_ = (evt) => this.handleDayClick_(evt);
    /** @private {function(!Event): undefined} */
    this.documentKeydownHandler_ = (evt) => this.handleDocumentKeydown_(evt);
    /** @private {function(!Event): undefined} */
    this.transitionEndHandler_ = (evt) => this.handleTransitionEnd_(evt);
    /** @private {function(!Event): undefined} */
    this.surfaceInteractionHandler_ = (evt) => this.handleSurfaceInteraction(evt);
    /** @private {function(!Event): undefined} */
    this.tableTransitionEndHandler_ = (evt) => this.handleTableTransitionEnd_(evt);
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
    if (this.label_ && this.getValue()) {
      this.label_.styleFloat(
        this.getValue(), this.isFocused_, this.isBadInput_());
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
    ['click', 'keydown', 'keyup'].forEach((evtType) => {
      this.adapter_.registerDatePickerInteractionHandler(evtType, this.datePickerInteractionHandler_);
    });
    this.adapter_.setupDayTables();
    this.adapter_.setupYearList(this.settings_.yearPageSize, this.settings_.minYear, this.settings_.maxYear);
  }

  destroy() {
    const {UPGRADED} = cssClasses;

    this.adapter_.removeClass(UPGRADED);
    this.adapter_.registerInputInteractionHandler('focus', this.inputFocusHandler_);
    this.adapter_.registerInputInteractionHandler('blur', this.inputBlurHandler_);
    this.adapter_.registerInputInteractionHandler('input', this.inputInputHandler_);
    ['click', 'keydown', 'keyup'].forEach((evtType) => {
      this.adapter_.deregisterDatePickerInteractionHandler(evtType, this.datePickerInteractionHandler_);
    });
    if (this.isOpen_) {
      ['click', 'keydown', 'keyup', 'wheel', 'touchstart', 'touchmove', 'touchend'].forEach((evtType) => {
        this.adapter_.deregisterSurfaceInteractionHandler(evtType, this.surfaceInteractionHandler_);
      });
      this.adapter_.deregisterDocumentClickHandler(this.bodyClickHandler_);
      this.adapter_.deregisterDayClickHandler(this.dayClickHandler_);
      this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
      this.adapter_.deregisterTableTransitionEndHandler(this.tableTransitionEndHandler_);
    }
  }

  getSettings() {
    return this.settings_ ;
  }

  setSettings(settings) {
    Object.assign(this.settings_, settings);
  }

  getDefaultSettings_() {
    return {
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],
      shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      minYear: 1900,
      maxYear: 2100,
      yearPageSize: 21,
      valueToString: (date) => this.valueToString_(date)
    };
  }

  valueToString_(date) {
    if (!date)
      return '';
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  }

  /** @return {?string} */
  getValue() {
    return this.value_;
  }

  /** @param {?string} value */
  setValue(value) {
    if (!value) {
      this.value_ = null;
      this.getNativeInput_().value = '';
      return;
    }
    if ((typeof value.getDate === 'function') || (typeof value === 'string')) {
      this.value_ = new Date(value);
      this.getNativeInput_().value = this.settings_.valueToString(this.value_);
      const isValid = this.isValid();
      this.styleValidity_(isValid);
      if (this.label_) {
        this.label_.styleShake(isValid, this.isFocused_);
        this.label_.styleFloat(
          this.getValue(), this.isFocused_, this.isBadInput_());
      }
    }
  }

  /**
   * @return {boolean} If a custom validity is set, returns that value.
   *     Otherwise, returns the result of native validity checks.
   */
  isValid() {
    return this.useCustomValidityChecking_
      ? this.isValid_ : this.isNativeInputValid_();
  }

  /**
   * @param {boolean} isValid Sets the validity state of the Date Picker.
   */
  setValid(isValid) {
    this.useCustomValidityChecking_ = true;
    this.isValid_ = isValid;
    // Retrieve from the getter to ensure correct logic is applied.
    isValid = this.isValid();
    this.styleValidity_(isValid);
    if (this.label_) {
      this.label_.styleShake(isValid, this.isFocused_);
    }
  }

  /**
   * @return {boolean} True if the Date Picker is disabled.
   */
  isDisabled() {
    return this.getNativeInput_().disabled;
  }

  /**
   * @param {boolean} disabled Sets the Date Picker disabled or enabled.
   */
  setDisabled(disabled) {
    this.getNativeInput_().disabled = disabled;
    this.styleDisabled_(disabled);
  }

  /**
   * @return {boolean} True if the Date Picker is read only.
   */
  isReadOnly() {
    return this.getNativeInput_().readOnly;
  }

  /**
   * @param {boolean} readOnly Sets the Date Picker read only.
   */
  /** @param {boolean} readOnly */
  setReadOnly(readOnly) {
    this.getNativeInput_().readOnly = readOnly;
  }

  /**
   * @return {boolean} True if the Date Picker is required.
   */
  isRequired() {
    return this.getNativeInput_().required;
  }

  /**
   * @param {boolean} isRequired Sets the Date Picker required or not.
   */
  setRequired(isRequired) {
    this.getNativeInput_().required = isRequired;
    // Addition of the asterisk is automatic based on CSS, but validity checking
    // needs to be manually run.
    this.styleValidity_(this.isValid());
  }

  /**
   * @return {boolean} True if the Date Picker input fails in converting the
   *     user-supplied value.
   * @private
   */
  isBadInput_() {
    return this.getNativeInput_().validity.badInput;
  }

  /**
   * @return {boolean} The result of native validity checking
   *     (ValidityState.valid).
   */
  isNativeInputValid_() {
    return this.getNativeInput_().validity.valid;
  }

  /**
   * Styles the component based on the validity state.
   * @param {boolean} isValid
   * @private
   */
  styleValidity_(isValid) {
    const {INVALID} = cssClasses;
    if (isValid) {
      this.adapter_.removeClass(INVALID);
    } else {
      this.adapter_.addClass(INVALID);
    }
    if (this.helperText_) {
      this.helperText_.setValidity(isValid);
    }
  }

  /**
   * Styles the component based on the focused state.
   * @param {boolean} isFocused
   * @private
   */
  styleFocused_(isFocused) {
    const {FOCUSED} = cssClasses;
    if (isFocused) {
      this.adapter_.addClass(FOCUSED);
    } else {
      this.adapter_.removeClass(FOCUSED);
    }
  }

  /**
   * Styles the component based on the disabled state.
   * @param {boolean} isDisabled
   * @private
   */
  styleDisabled_(isDisabled) {
    const {DISABLED, INVALID} = cssClasses;
    const {ARIA_DISABLED} = strings;
    if (isDisabled) {
      this.adapter_.setAttr(ARIA_DISABLED, 'true');
      this.adapter_.addClass(DISABLED);
      this.adapter_.removeClass(INVALID);
    } else {
      this.adapter_.rmAttr(ARIA_DISABLED);
      this.adapter_.removeClass(DISABLED);
    }
  }

  /**
   * Handles user interactions with the Date Picker.
   * @param {!Event} evt
   */
  handleDatePickerInteraction(evt) {
    const {SURFACE} = cssClasses;
    if ((this.getNativeInput_().disabled) || (this.getNativeInput_().readOnly)) {
      return;
    }
    this.receivedUserInput_ = true;
    if ((evt.type === 'click') && (!this.isOpen())) {
      if (this.adapter_.eventTargetInSurface(evt.target))
        return;
      this.open_();
    }
    const isOpenerKey = OPENER_KEYS.some(({key, keyCode, forType}) => {
      return evt.type === forType && (evt.key === key || evt.keyCode === keyCode);
    });

    if ((isOpenerKey) && (!this.isOpen())) {
      evt.preventDefault();
      evt.stopPropagation();
      this.open_();
    }
  }

  /**
   * Activates the Date Picker focus state.
   */
  activateFocus() {
    const {ANIMATING} = cssClasses;
    this.isFocused_ = true;
    this.styleFocused_(this.isFocused_);
    if (this.label_) {
      this.label_.styleShake(this.isValid(), this.isFocused_);
      this.label_.styleFloat(
        this.getValue(), this.isFocused_, this.isBadInput_());
    }
    if ((!this.getNativeInput_().readOnly) && (!this.isOpen()) &&
      (!this.adapter_.hasClass(ANIMATING)))
      this.open_();
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
    const input = this.getNativeInput_();
    const shouldRemoveLabelFloat = !input.value && !this.isBadInput_();

    this.isFocused_ = false;
    this.styleFocused_(this.isFocused_);
    if (this.label_) {
      this.label_.styleShake(this.isValid(), this.isFocused_);
      this.label_.styleFloat(
        this.getValue(), this.isFocused_, this.isBadInput_());
    }
    if (shouldRemoveLabelFloat) {
      this.receivedUserInput_ = false;
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
      value: '',
      disabled: false,
      readOnly: false,
      validity: {
        badInput: false,
        valid: true,
      }
    });
  }

  /**
   * Handle clicks and cancel the component if not a children
   * @param {!Event} evt
   * @private
   */
  handleDocumentClick_(evt) {
    const {ANIMATING, ROOT, SURFACE} =  cssClasses;

    if (this.adapter_.eventTargetInSurface(evt.target))
      return;
    if (this.adapter_.eventTargetInDatePicker(evt.target) &&
      this.adapter_.hasClass(ANIMATING))
      return;

    this.adapter_.notifyCancel();
    this.close_();
  };

  handleSurfaceInteraction(evt) {
    if (evt.type === 'click')
      this.handleSurfaceClick_(evt);
    else if (evt.type === 'keydown')
      this.handleSurfaceKeydown_(evt);
    else if (evt.type === 'keyup')
      this.handleSurfaceKeyup_(evt);
    else if (evt.type === 'wheel')
      this.handleSurfaceWheel_(evt);
    else if (evt.type === 'touchstart')
      this.handleSurfaceTouchStart_(evt);
    else if (evt.type === 'touchmove')
      this.handleSurfaceTouchMove_(evt);
    else if (evt.type === 'touchend')
      this.handleSurfaceTouchEnd_(evt);
  }

  handleSurfaceClick_(evt) {
    const {ACCEPT_BTN, BUTTON, BUTTON_YEAR, CALENDAR_YEAR, CANCEL_BTN, NEXT_BTN, PREV_BTN,
      YEAR_LIST_ANIMATING, YEAR_SELECTED, YEAR_VIEW} = cssClasses;
    if (!this.adapter_.hasClass(YEAR_VIEW)) {
      if (this.adapter_.eventTargetHasClass(evt.target, ACCEPT_BTN)) {
        this.accept(true);
      } else if (this.adapter_.eventTargetHasClass(evt.target, CANCEL_BTN)) {
        this.cancel(true);
      } else if ((this.adapter_.eventTargetHasClass(evt.target, NEXT_BTN)) ||
        (evt.target.parentElement && (this.adapter_.eventTargetHasClass(evt.target.parentElement, NEXT_BTN)))) {
        this.shiftMonth_(1, false);
      } else if ((this.adapter_.eventTargetHasClass(evt.target, PREV_BTN)) ||
        (evt.target.parentElement && (this.adapter_.eventTargetHasClass(evt.target.parentElement, PREV_BTN)))) {
        this.shiftMonth_(-1, false);
      } else if (this.adapter_.eventTargetHasClass(evt.target, BUTTON_YEAR)) {
        let offsetHeight = this.adapter_.getYearListOffsetHeight();
        let clientHeight = this.adapter_.getYearSelectionClientHeight();
        this.displayYear_ = this.displayValue_.getFullYear();
        this.adapter_.setYearListStyleProperty('top', Math.floor(-(offsetHeight - clientHeight) / 2) + 'px');
        this.adapter_.removeYearClass(Math.floor(this.settings_.yearPageSize / 2), YEAR_SELECTED);
        this.adapter_.setFirstYear(this.displayYear_ - Math.floor(this.settings_.yearPageSize / 2));
        this.adapter_.addYearClass(Math.floor(this.settings_.yearPageSize / 2), YEAR_SELECTED);
        this.adapter_.addClass(YEAR_VIEW);
      }
    } else {
      if (this.adapter_.eventTargetHasClass(evt.target, ACCEPT_BTN)) {
        this.updateCalendarYear_(this.displayYear_);
        this.adapter_.removeYearListClass(YEAR_LIST_ANIMATING);
        this.adapter_.removeClass(YEAR_VIEW);
        this.adapter_.setMonthFocus();
      } else if (this.adapter_.eventTargetHasClass(evt.target, CANCEL_BTN)) {
        this.adapter_.removeYearListClass(YEAR_LIST_ANIMATING);
        this.adapter_.removeClass(YEAR_VIEW);
        this.adapter_.setMonthFocus();
      } else if (this.adapter_.eventTargetHasClass(evt.target, CALENDAR_YEAR)) {
        let dateAttr = this.adapter_.eventTargetDateAttr(evt.target);
        if (dateAttr['year']) {
          this.updateCalendarYear_(+dateAttr['year']);
          this.adapter_.removeYearListClass(YEAR_LIST_ANIMATING);
          this.adapter_.removeClass(YEAR_VIEW);
          this.adapter_.setMonthFocus();
        }
      }
    }
  }

  updateCalendarYear_(year) {
    const {DAY_SELECTED} = cssClasses;
    this.selectedValue_.setFullYear(year);
    this.displayValue_ = new Date(this.selectedValue_);
    this.adapter_.removeAllDaysClass(DAY_SELECTED);
    this.adapter_.addDayClassAndFocus(this.selectedValue_, DAY_SELECTED, false);
    this.updatePrimary_(this.displayValue_);
    this.updateHeader_(this.displayValue_);
    this.updateDaysTable_();
  }

  handleSurfaceKeydown_(evt) {
    const {ACCEPT_BTN, BUTTON, BUTTON_YEAR, CALENDAR_YEAR, CANCEL_BTN, YEAR_LIST_ANIMATING, YEAR_VIEW} = cssClasses;
    if ((evt.key && evt.key === 'PageUp' || evt.keyCode === 33) ||
      (evt.key && evt.key === 'PageDown' || evt.keyCode === 34) ||
      (evt.key && evt.key === 'ArrowLeft' || evt.keyCode === 37) ||
      (evt.key && evt.key === 'ArrowRight' || evt.keyCode === 39) ||
      (evt.key && evt.key === 'ArrowUp' || evt.keyCode === 38) ||
      (evt.key && evt.key === 'ArrowDown' || evt.keyCode === 40)) {
      evt.preventDefault();
      return;
    }
    if (!this.adapter_.hasClass(YEAR_VIEW)) {
      if (evt.key && evt.key === 'Escape' || evt.keyCode === 27) {
        this.cancel(true);
      }
      if (!this.adapter_.eventTargetHasClass(evt.target, BUTTON) &&
        !this.adapter_.eventTargetHasClass(evt.target, CANCEL_BTN) &&
        !this.adapter_.eventTargetHasClass(evt.target, CALENDAR_YEAR)) {
        if (evt.key && evt.key === 'Enter' || evt.keyCode === 13) {
          this.accept(true);
        }
      }
    } else {
      if (evt.key && evt.key === 'Escape' || evt.keyCode === 27) {
        evt.preventDefault();
        evt.stopPropagation();
        this.adapter_.removeYearListClass(YEAR_LIST_ANIMATING);
        this.adapter_.removeClass(YEAR_VIEW);
        this.adapter_.setMonthFocus();
      }
      if (!this.adapter_.eventTargetHasClass(evt.target, CANCEL_BTN)) {
        if (evt.key && evt.key === 'Enter' || evt.keyCode === 13) {
          evt.preventDefault();
          this.updateCalendarYear_(this.displayYear_);
          this.adapter_.removeYearListClass(YEAR_LIST_ANIMATING);
          this.adapter_.removeClass(YEAR_VIEW);
          if (!this.adapter_.eventTargetHasClass(evt.target, ACCEPT_BTN))
            this.adapter_.setMonthFocus();
        }
      }
    }
  }

  handleSurfaceKeyup_(evt) {
    const {YEAR_LIST_ANIMATING, YEAR_VIEW} = cssClasses;
    if (!this.adapter_.hasClass(YEAR_VIEW)) {
      if (evt.key && evt.key === 'PageUp' || evt.keyCode === 33) {
        evt.preventDefault();
        this.shiftMonth_(-1, true);
      } else if (evt.key && evt.key === 'PageDown' || evt.keyCode === 34) {
        evt.preventDefault();
        this.shiftMonth_(1, true);
      } else if (evt.key && evt.key === 'ArrowLeft' || evt.keyCode === 37) {
        evt.preventDefault();
        this.shiftSelected(-1);
      } else if (evt.key && evt.key === 'ArrowRight' || evt.keyCode === 39) {
        evt.preventDefault();
        this.shiftSelected(1);
      } else if (evt.key && evt.key === 'ArrowUp' || evt.keyCode === 38) {
        evt.preventDefault();
        this.shiftSelected(-7);
      } else if (evt.key && evt.key === 'ArrowDown' || evt.keyCode === 40) {
        evt.preventDefault();
        this.shiftSelected(7);
      }
    } else {
      if (evt.key && evt.key === 'ArrowLeft' || evt.keyCode === 37) {
        this.adapter_.removeYearListClass(YEAR_LIST_ANIMATING);
        this.adapter_.removeClass(YEAR_VIEW);
        this.adapter_.setMonthFocus();
      } else if (evt.key && evt.key === 'ArrowRight' || evt.keyCode === 39) {
        this.adapter_.removeYearListClass(YEAR_LIST_ANIMATING);
        this.adapter_.removeClass(YEAR_VIEW);
        this.adapter_.setMonthFocus();
      } else if ((evt.key && evt.key === 'PageUp' || evt.keyCode === 33) ||
        (evt.key && evt.key === 'PageDown' || evt.keyCode === 34)) {
        evt.preventDefault();
        let shift = 6;
        if (evt.key && evt.key === 'PageUp' || evt.keyCode === 33)
          shift = -6;
        this.shiftYear_(shift);
      } else if ((evt.key && evt.key === 'ArrowUp' || evt.keyCode === 38) ||
        (evt.key && evt.key === 'ArrowDown' || evt.keyCode === 40)) {
        evt.preventDefault();
        let shift = 1;
        if (evt.key && evt.key === 'ArrowUp' || evt.keyCode === 38)
          shift = -1;
        this.shiftYear_(shift);
      }
    }
  }

  handleSurfaceWheel_(evt) {
    const {YEAR_VIEW} = cssClasses;
    evt.preventDefault();
    requestAnimationFrame(() => {
      if (!this.adapter_.hasClass(YEAR_VIEW)) {
        if (evt.deltaY > 0) {
          this.shiftMonth_(1, true);
        } else if (evt.deltaY < 0) {
          this.shiftMonth_(-1, true);
        }
      }
      else {
        if (evt.deltaY > 0) {
          this.shiftYear_(1);
        } else if (evt.deltaY < 0) {
          this.shiftYear_(-1);
        }
      }
    });
  }

  handleSurfaceTouchStart_(evt) {
    if (evt.pointerType && evt.pointerType !== 'touch') {
      return;
    }

    this.startY_ = evt.touches ? evt.touches[0].pageY : evt.pageY;
    this.currentY_ = this.startY_;
  }

  handleSurfaceTouchMove_(evt) {
    if (evt.pointerType && evt.pointerType !== 'touch') {
      return;
    }

    evt.preventDefault();
    this.currentY_ = evt.touches ? evt.touches[0].pageY : evt.pageY;
  }

  handleSurfaceTouchEnd_(evt) {
    const {YEAR_VIEW} = cssClasses;
    if (evt.pointerType && evt.pointerType !== 'touch') {
      return;
    }

    if (!this.adapter_.hasClass(YEAR_VIEW)) {
    }
    else {
      let shift = 0;
      if (Math.abs((this.currentY_ - this.startY_) / this.adapter_.getYearSelectionClientHeight()) >= 0.5) {
        shift = 4;
      } else if (Math.abs((this.currentY_ - this.startY_) / this.adapter_.getYearSelectionClientHeight()) >= 0.10) {
        shift = 1;
      }
      if (shift > 0) {
        evt.preventDefault();
        if ((this.currentY_ - this.startY_) > 0)
          shift = shift * -1;
        this.shiftYear_(shift);
      }
    }
  }

  /**
   * Handle day clicks
   * @param {!Event} evt
   * @private
   */
  handleDayClick_(evt) {
    const {CALENDAR_DAY, DAY_SELECTED} = cssClasses;
    if (this.adapter_.eventTargetHasClass(evt.target, CALENDAR_DAY)) {
      let dateAttr = this.adapter_.eventTargetDateAttr(evt.target);
      this.selectedValue_.setFullYear(+dateAttr['year']);
      this.selectedValue_.setMonth(+dateAttr['month'], +dateAttr['date']);
      this.displayValue_ = new Date(this.selectedValue_);
      this.adapter_.removeAllDaysClass(DAY_SELECTED);
      this.adapter_.addDayClassAndFocus(this.selectedValue_, DAY_SELECTED, false);
      this.updatePrimary_(this.selectedValue_);
    }
  };

  /**
   * Handle key down and cancel the component if needed
   * @param {!Event} evt
   * @private
   */
  handleDocumentKeydown_(evt) {
  };

  shiftMonth_(shift, updateFocus) {
    const {DAY_TABLE_ACTIVE, DAY_TABLE_ANIMATING, DAY_TABLE_HIDDEN, DAY_TABLE_NEXT, DAY_TABLE_PREV} = cssClasses;
    const {TYPE_ACTIVE, TYPE_HIDDEN, TYPE_NEXT, TYPE_PREV} = strings;
    if (updateFocus)
      this.adapter_.setMonthFocus();
    let typeToShow = TYPE_NEXT;
    let classToShow = DAY_TABLE_NEXT;
    let typeToHide = TYPE_PREV;
    let classToHide = DAY_TABLE_PREV;
    if (shift > 0) {
      this.displayValue_ = new Date(this.displayValue_.getFullYear(), this.displayValue_.getMonth() + 1, 1);
    }
    else {
      this.displayValue_ = new Date(this.displayValue_.getFullYear(), this.displayValue_.getMonth(), 0);
      let typeToShow = TYPE_PREV;
      let classToShow = DAY_TABLE_PREV;
      let typeToHide = TYPE_NEXT;
      let classToHide = DAY_TABLE_NEXT;
    }
    this.updateHeader_(this.displayValue_);
    this.adapter_.replaceTableBody(TYPE_NEXT, this.buildTableData_(this.displayValue_));
    this.adapter_.replaceTableClass(typeToHide, classToHide, DAY_TABLE_HIDDEN);
    this.adapter_.replaceTableClass(typeToShow, null, DAY_TABLE_ANIMATING);
    this.adapter_.replaceTableClass(TYPE_ACTIVE, DAY_TABLE_ACTIVE, classToHide);
    this.adapter_.replaceTableClass(typeToShow, classToShow, DAY_TABLE_ACTIVE);
    this.adapter_.registerTableTransitionEndHandler(this.tableTransitionEndHandler_);
    this.adapter_.replaceTableClass(TYPE_HIDDEN, DAY_TABLE_HIDDEN, classToShow);
    this.adapter_.notifyChange({type: typeToShow});
  }

  shiftSelected(days) {
    const {DAY_SELECTED} = cssClasses;
    if (!this.selectedValue_)
      this.selectedValue_ = new Date();
    let differentMonth = false;
    this.adapter_.removeAllDaysClass(DAY_SELECTED);
    if ((this.selectedValue_.getMonth() != this.displayValue_.getMonth()) ||
      (this.selectedValue_.getFullYear() != this.displayValue_.getFullYear())) {
      this.selectedValue_ = new Date(this.displayValue_);
      if (days < 0) {
        this.selectedValue_.setDate(32);
        this.selectedValue_.setDate(0);
      } else {
        this.selectedValue_.setDate(1);
      }
    } else {
      this.displayValue_ = new Date(this.selectedValue_);
      this.selectedValue_.setDate(this.selectedValue_.getDate() + days);
      if (this.selectedValue_.getMonth() != this.displayValue_.getMonth()) {
        differentMonth = true;
        if (days < 0)
          this.shiftMonth_(-1, true);
        else
          this.shiftMonth_(1, true);
      }
    }
    this.updatePrimary_(this.selectedValue_);
    this.adapter_.addDayClassAndFocus(this.selectedValue_, DAY_SELECTED, !differentMonth);
  }

  /**
   * Applies the year position shift.
   * @private
   */
  shiftYear_(shift) {
    const {YEAR_LIST_ANIMATING, YEAR_SELECTED} = cssClasses;
    let appliedShift = shift;
    if ((this.displayYear_ + appliedShift) < this.settings_.minYear)
      appliedShift = this.settings_.minYear - this.displayYear_;
    else if ((this.displayYear_ + appliedShift) > this.settings_.maxYear)
      appliedShift = this.settings_.maxYear - this.displayYear_;
    if (appliedShift === 0)
      return;
    let translatePx = - this.adapter_.getYearOffsetHeight(0) * appliedShift;
    const transformProp = getCorrectPropertyName(window, 'transform');

    if (!this.animatingYear_) {
      const onTransitionEnd = () => {
        this.adapter_.removeYearListClass(YEAR_LIST_ANIMATING);
        this.animatingYear_ = false;
        this.adapter_.deregisterYearTransitionEndHandler(onTransitionEnd);
        this.displayYear_ = this.displayYear_ + appliedShift;
        requestAnimationFrame(() => {
          this.adapter_.setFirstYear(this.displayYear_ - Math.floor(this.settings_.yearPageSize / 2));
          this.adapter_.setYearListStyleProperty(transformProp, `translateY(0px)`);
          this.adapter_.addYearClass(Math.floor(this.settings_.yearPageSize / 2), YEAR_SELECTED);
        });
      };
      requestAnimationFrame(() => {
        this.adapter_.removeYearClass(Math.floor(this.settings_.yearPageSize / 2), YEAR_SELECTED);
        this.adapter_.addYearListClass(YEAR_LIST_ANIMATING);
      });
      this.animatingYear_ = true;
      this.adapter_.registerYearTransitionEndHandler(onTransitionEnd);
    }

    requestAnimationFrame(() => {
      this.adapter_.setYearListStyleProperty(transformProp, `translateY(${translatePx}px)`);
    });
  }

  updateDaysTable_() {
    const {TYPE_ACTIVE} = strings;
    this.adapter_.replaceTableBody(TYPE_ACTIVE, this.buildTableData_(this.displayValue_));
  }

  buildTableData_(date) {
    const {DAY_SELECTED} = cssClasses;
    let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDayDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let lastDayOfMonth = lastDayDate.getDate();
    let tableData = [[], [], [], [], [], []];
    let firstDayOfWeek = firstDayOfMonth.getDay();
    let dayData = null;
    for (let i = 0; i < firstDayOfWeek; i++)
      tableData[0].push({
        enabled: false
      });
    for (let i = 1; i <= lastDayOfMonth; i++) {
      dayData = {
        content: i,
        date: i,
        enabled: true,
        month: date.getMonth(),
        year: date.getFullYear()
      };
      if (this.selectedValue_) {
        if ((this.selectedValue_.getFullYear() === date.getFullYear()) &&
          (this.selectedValue_.getMonth() === date.getMonth()) &&
          (this.selectedValue_.getDate() === i))
          dayData.cssClass = DAY_SELECTED;
      }
      tableData[Math.floor((firstDayOfWeek + i - 1)/7)].push(dayData);
    }
    return tableData;
  }

  updateHeader_(date) {
    this.adapter_.setMonthContent(this.settings_.months[date.getMonth()] + ' ' + date.getFullYear());
  }

  updatePrimary_(date) {
    this.adapter_.setWeekDayContent(this.settings_.days[date.getDay()] + ',');
    this.adapter_.setDateContent(this.settings_.shortMonths[date.getMonth()] + ' ' + date.getDate());
    this.adapter_.setYearContent(date.getFullYear());
  }

  handleTableTransitionEnd_(evt) {
    const {DAY_TABLE_ANIMATING, DAY_TABLE_NEXT, DAY_TABLE_PREV} = cssClasses;
    const {TYPE_ACTIVE, TYPE_HIDDEN, TYPE_NEXT, TYPE_PREV} = strings;
    if (this.adapter_.eventTargetHasClass(evt.target, DAY_TABLE_ANIMATING)) {
      this.adapter_.deregisterTableTransitionEndHandler(this.tableTransitionEndHandler_);
      this.adapter_.replaceTableClass(TYPE_ACTIVE, DAY_TABLE_ANIMATING, null);
      this.adapter_.replaceTableClass(TYPE_NEXT, DAY_TABLE_ANIMATING, null);
      this.adapter_.replaceTableClass(TYPE_PREV, DAY_TABLE_ANIMATING, null);
    };
  };

  open_() {
    const {ANIMATING, OPEN} = cssClasses;
    if (!this.selectedValue_)
      this.selectedValue_ = new Date();
    this.displayValue_ = new Date(this.selectedValue_);
    this.updatePrimary_(this.displayValue_);
    this.updateHeader_(this.displayValue_);
    this.updateDaysTable_();
    this.adapter_.registerDocumentKeydownHandler(this.documentKeydownHandler_);
    ['click', 'keydown', 'keyup', 'wheel', 'touchstart', 'touchmove', 'touchend'].forEach((evtType) => {
      this.adapter_.registerSurfaceInteractionHandler(evtType, this.surfaceInteractionHandler_);
    });
    this.adapter_.registerDocumentClickHandler(this.bodyClickHandler_);
    this.adapter_.registerDayClickHandler(this.dayClickHandler_);
    // this.adapter_.registerInteractionHandler('click', this.componentClickHandler_);
    this.adapter_.registerTransitionEndHandler(this.transitionEndHandler_);
    this.adapter_.addClass(ANIMATING);
    this.adapter_.addClass(OPEN);
    this.isOpen_ = true;
  }

  close_() {
    const {ANIMATING, OPEN, YEAR_LIST_ANIMATING, YEAR_VIEW} = cssClasses;
    this.adapter_.deregisterDocumentKeydownHandler(this.documentKeydownHandler_);
    ['click', 'keydown', 'keyup', 'wheel', 'touchstart', 'touchmove', 'touchend'].forEach((evtType) => {
      this.adapter_.deregisterSurfaceInteractionHandler(evtType, this.surfaceInteractionHandler_);
    });
    this.adapter_.deregisterDocumentClickHandler(this.bodyClickHandler_);
    this.adapter_.deregisterDayClickHandler(this.dayClickHandler_);
    // this.adapter_.deregisterInteractionHandler('click', this.componentClickHandler_);
    this.adapter_.untrapFocusOnSurface();
    this.adapter_.registerTransitionEndHandler(this.transitionEndHandler_);
    this.adapter_.addClass(ANIMATING);
    this.adapter_.removeClass(OPEN);
    this.adapter_.removeYearListClass(YEAR_LIST_ANIMATING);
    this.adapter_.removeClass(YEAR_VIEW);
    this.isOpen_ = false;
  }

  handleTransitionEnd_(evt) {
    const {ANIMATING, SURFACE} = cssClasses;
    if (this.adapter_.eventTargetHasClass(evt.target, SURFACE)) {
      this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
      this.adapter_.removeClass(ANIMATING);
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
    this.setValue(new Date(this.selectedValue_));
    this.close_();
  }

  cancel(shouldNotify) {
    if (shouldNotify) {
      this.adapter_.notifyCancel();
    }
    if (this.value_)
      this.selectedValue_ = new Date(this.value_);
    this.close_();
  }
}
