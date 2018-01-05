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
    this.surfaceEl_;
    /** @private {?Element} */
    this.buttonYearEl_;
    /** @private {?Element} */
    this.acceptButton_;
    /** @private {?Element} */
    this.cancelButton_;
    /** @private {?Object} */
    this.focusTrap_;
    /** @private {?Element} */
    this.prevEl_;
    /** @private {?Element} */
    this.nextEl_;
    /** @private {?Element} */
    this.txtDateEl_;
    /** @private {?Element} */
    this.txtMonthEl_;
    /** @private {?Element} */
    this.yearSelectionEl_;
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
    this.surfaceEl_ = this.root_.querySelector(strings.SURFACE_SELECTOR);
    this.buttonYearEl_ = this.root_.querySelector(strings.BUTTON_YEAR_SELECTOR);
    this.acceptButton_ = this.root_.querySelector(strings.ACCEPT_SELECTOR);
    this.cancelButton_ = this.root_.querySelector(strings.CANCEL_SELECTOR);
    this.focusTrap_ = createFocusTrapInstance(this.surfaceEl_, null);
    this.prevEl_ = this.root_.querySelector(strings.PREV_SELECTOR);
    this.nextEl_ = this.root_.querySelector(strings.NEXT_SELECTOR);
    this.txtDateEl_ = this.root_.querySelector(strings.TXT_DATE_SELECTOR);
    this.txtMonthEl_ = this.root_.querySelector(strings.TXT_MONTH_SELECTOR);
    this.txtWeekDayEl_ = this.root_.querySelector(strings.TXT_WEEK_DAY_SELECTOR);
    this.monthsEl_ =  this.root_.querySelector(strings.MONTHS_SELECTOR);
    this.yearSelectionEl_ = this.root_.querySelector(strings.YEAR_SELECTION_SELECTOR);

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
        addYearSelectionClass: (className) => this.yearSelectionEl_ && this.yearSelectionEl_.classList.add(className),
        removeYearSelectionClass: (className) => this.yearSelectionEl_ && this.yearSelectionEl_.classList.remove(className),
        hasClass: (className) => this.root_.classList.contains(className),
        hasNecessaryDom: () => Boolean(this.input_) && Boolean(this.surfaceEl_) && Boolean(this.monthsEl_) &&
          Boolean(this.prevEl_) && Boolean(this.nextEl_),
        eventTargetHasClass: (target, className) => target.classList.contains(className),
        getDayTableDimensions: () => this.dayTableEl_.getBoundingClientRect(),
        registerDatePickerInteractionHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
        deregisterDatePickerInteractionHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
        registerTransitionEndHandler: (handler) => this.surfaceEl_.addEventListener('transitionend', handler),
        deregisterTransitionEndHandler: (handler) => this.surfaceEl_.removeEventListener('transitionend', handler),
        registerPrevInteractionHandler: (type, handler) => this.prevEl_.addEventListener(type, handler),
        deregisterPrevInteractionHandler: (type, handler) => this.prevEl_.removeEventListener(type, handler),
        registerNextInteractionHandler: (type, handler) => this.nextEl_.addEventListener(type, handler),
        deregisterNextInteractionHandler: (type, handler) => this.nextEl_.removeEventListener(type, handler),
        registerDocumentKeydownHandler: (handler) => document.addEventListener('keydown', handler),
        deregisterDocumentKeydownHandler: (handler) => document.removeEventListener('keydown', handler),
        registerSurfaceInteractionHandler: (evtType, handler) => this.surfaceEl_.addEventListener(evtType, handler),
        deregisterSurfaceInteractionHandler: (evtType, handler) => this.surfaceEl_.removeEventListener(evtType, handler),
        registerBodyClickHandler: (handler) => document.body.addEventListener('click', handler),
        deregisterBodyClickHandler: (handler) => document.body.removeEventListener('click', handler),
        registerDayClickHandler: (handler) => this.monthsEl_.addEventListener('click', handler),
        deregisterDayClickHandler: (handler) => this.monthsEl_.removeEventListener('click', handler),
        registerTableTransitionEndHandler: (handler) => this.monthsEl_.addEventListener('transitionend', handler),
        deregisterTableTransitionEndHandler: (handler) => this.monthsEl_.removeEventListener('transitionend', handler),
        setupDayTables: () => this.setupDayTables_(),
        replaceTableBody: (tableType, tableData) => this.replaceTableBody_(tableType, tableData),
        replaceTableClass: (tableType, fromClassName, toClassName) => this.replaceTableClass_(tableType, fromClassName, toClassName),
        setDateContent: (value) => ((this.txtDateEl_) && (this.txtDateEl_.textContent = value)),
        setMonthContent: (value) => ((this.txtMonthEl_) && (this.txtMonthEl_.textContent = value)),
        setWeekDayContent: (value) => ((this.txtWeekDayEl_) && (this.txtWeekDayEl_.textContent = value)),
        setYearContent: (value) => ((this.buttonYearEl_) && (this.buttonYearEl_.textContent = value)),
        getDayAttr: (el) => ({
          date: el.getAttribute(strings.DATA_DATE),
          month: el.getAttribute(strings.DATA_MONTH),
          year: el.getAttribute(strings.DATA_YEAR)
        }),
        getDayElement: (date) => this.getDayElement_(date),
        addDayClass: (el, className) => el.classList.add(className),
        removeAllDaysClass: (className) => this.removeAllDaysClass_(className),
        focusDayElement: (el) => el.focus(),
        setupYearList: (minYear, maxYear) => this.setupYearList_(minYear, maxYear),
        scrollToYear: (year) => this.scrollToYear_(year),
        setInputValue: (value) => this.input_.value = value,
        getTabIndex: () => this.root_.tabIndex,
        setTabIndex: (tabIndex) => this.root_.tabIndex = tabIndex,
        getAttr: (name) => this.root_.getAttribute(name),
        setAttr: (name, value) => this.root_.setAttribute(name, value),
        rmAttr: (name) => this.root_.removeAttribute(name),
        setMonthsHeight: (height) => { this.monthsEl_.height = height },
        setMonthsWidth: (width) => { this.monthsEl_.width = width },
        getPrevNativeControl: () => this.prevEl_,
        getNextNativeControl: () => this.nextEl_,
        setPrevAttr: (name, value) => this.prevEl_.setAttribute(name, value),
        rmPrevAttr: (name) => this.prevEl_.removeAttribute(name),
        setNextAttr: (name, value) => this.nextEl_.setAttribute(name, value),
        rmNextAttr: (name) => this.nextEl_.removeAttribute(name),
        isFocused: () => document.activeElement === this.root_.querySelector(strings.INPUT_SELECTOR),
        isRtl: () => window.getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
        notifyAccept: () => this.emit(strings.ACCEPT_EVENT),
        notifyCancel: () => this.emit(strings.CANCEL_EVENT),
        notifyChange: (evtData) => this.emit(strings.CHANGE_EVENT, {type: evtData.type}),
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

  /** @return {?Date} */
  get value() {
    return this.foundation_.getValue();
  }

  set value(value) {
    this.foundation_.setValue(value);
  }

  get settings() {
    return this.foundation_.getSettings();
  }

  set settings(settings) {
    return this.foundation_.setSettings(settings);
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

  setupDayTables_() {
    const {DAY_TABLE_ACTIVE, DAY_TABLE_NEXT, DAY_TABLE_PREV} = cssClasses;
    const {DAY_TABLE_SELECTOR} = strings;
    let dayTable = this.root_.querySelector(DAY_TABLE_SELECTOR);
    let clonedTable = dayTable.cloneNode(true);
    clonedTable.classList.add(DAY_TABLE_ACTIVE);
    clonedTable.classList.add('table2');
    this.monthsEl_.appendChild(clonedTable);
    clonedTable = dayTable.cloneNode(true);
    clonedTable.classList.add(DAY_TABLE_NEXT);
    clonedTable.classList.add('table3');
    this.monthsEl_.appendChild(clonedTable);
    dayTable.classList.add(DAY_TABLE_PREV);
    dayTable.classList.add('table1');
  }

  replaceTableBody_(tableType, tableData) {
    const {CALENDAR_DAY} = cssClasses;
    const {ARIA_DISABLED, DATA_DATE, DATA_MONTH, DATA_YEAR, DAY_ROWS_SELECTOR, DAY_TABLE_ACTIVE_SELECTOR,
      DAY_TABLE_NEXT_SELECTOR, DAY_TABLE_PREV_SELECTOR, TYPE_NEXT, TYPE_PREV} = strings;
    let tableEl = undefined;
    if (tableType === TYPE_NEXT)
      tableEl = this.root_.querySelector(DAY_TABLE_NEXT_SELECTOR);
    else if (tableType === TYPE_PREV)
      tableEl = this.root_.querySelector(DAY_TABLE_PREV_SELECTOR);
    else
      tableEl = this.root_.querySelector(DAY_TABLE_ACTIVE_SELECTOR);
    if (!tableEl)
      return;
    let rows = tableEl.querySelectorAll(DAY_ROWS_SELECTOR);
    for (let i = 0; i < 6; i++) {
      if (rows[i]) {
        this.removeChildElements(rows[i])
        for (let j = 0; j < 7; j++) {
          let tdNode = document.createElement('td');
          if (tableData[i] && tableData[i][j]) {
            if (tableData[i][j]['content']) {
              tdNode.setAttribute('role', 'button');
              tdNode.setAttribute('tabindex', '-1');
              tdNode.setAttribute(DATA_DATE, tableData[i][j]['date']);
              tdNode.setAttribute(DATA_MONTH, tableData[i][j]['month']);
              tdNode.setAttribute(DATA_YEAR, tableData[i][j]['year']);
              tdNode.classList.add(CALENDAR_DAY);
              if (!tableData[i][j]['enabled'])
                tdNode.setAttribute(ARIA_DISABLED, 'true');
              tdNode.textContent = tableData[i][j]['content'];
            }
            if (tableData[i][j]['cssClass']) {
              tdNode.classList.add(tableData[i][j]['cssClass']);
            }
          }
          rows[i].appendChild(tdNode);
        }
      }
    }
  }

  removeChildElements(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  replaceTableClass_(tableType, fromClassName, toClassName) {
    const {DAY_TABLE_ACTIVE_SELECTOR, DAY_TABLE_HIDDEN_SELECTOR, DAY_TABLE_NEXT_SELECTOR,
      DAY_TABLE_PREV_SELECTOR, TYPE_HIDDEN, TYPE_NEXT, TYPE_PREV} = strings;
    let tableEl = undefined;
    if (tableType === TYPE_HIDDEN)
      tableEl = this.root_.querySelector(DAY_TABLE_HIDDEN_SELECTOR);
    else if (tableType === TYPE_NEXT)
      tableEl = this.root_.querySelector(DAY_TABLE_NEXT_SELECTOR);
    else if (tableType === TYPE_PREV)
      tableEl = this.root_.querySelector(DAY_TABLE_PREV_SELECTOR);
    else
      tableEl = this.root_.querySelector(DAY_TABLE_ACTIVE_SELECTOR);
    if (!tableEl)
      return;
    if (fromClassName)
      tableEl.classList.remove(fromClassName);
    if (toClassName)
      tableEl.classList.add(toClassName);
  }

  getDayElement_(date) {
    const {CALENDAR_DAY_SELECTOR, DATA_DATE, DATA_MONTH, DATA_YEAR} = strings;
    let elements = this.monthsEl_.querySelectorAll(CALENDAR_DAY_SELECTOR);
    let dataDate = 0;
    let dataMonth = 0;
    let dataYear = 0;
    for (let i = 0, l = elements.length; i < l; i++) {
      dataDate = +elements[i].getAttribute(DATA_DATE);
      dataMonth = +elements[i].getAttribute(DATA_MONTH);
      dataYear = +elements[i].getAttribute(DATA_YEAR);
      if ((date.getDate() === dataDate) && (date.getMonth() === dataMonth) &&
        (date.getFullYear() === dataYear))
        return elements[i];
    }
    return null;
  }

  removeAllDaysClass_(className) {
    const {CALENDAR_DAY_SELECTOR} = strings;
    let elements = this.monthsEl_.querySelectorAll(CALENDAR_DAY_SELECTOR);
    for (let i = 0, l = elements.length; i < l; i++) {
      elements[i].classList.remove(className);
    }
  }

  setupYearList_(minYear, maxYear) {
    const {DATA_YEAR, YEAR_LIST_SELECTOR} = strings;
    let yearListEl = this.surfaceEl_.querySelector(YEAR_LIST_SELECTOR);
    if (!yearListEl)
      return;
    let el = yearListEl;
    while (el.firstChild) el.removeChild(el.firstChild);
    for (let i = minYear; i <= maxYear; i++) {
      let liNode = document.createElement('li');
      liNode.setAttribute(DATA_YEAR, i);
      liNode.textContent = i;
      yearListEl.appendChild(liNode);
    }
  }

  scrollToYear_(year) {
    const {DATA_YEAR, YEAR_LIST_SELECTOR} = strings;
    let yearListEl = this.surfaceEl_.querySelector(YEAR_LIST_SELECTOR);
    if (!yearListEl)
      return;
    let elements = yearListEl.querySelectorAll('li');
    let dataYear = 0;
    for (let i = 0, l = elements.length; i < l; i++) {
      dataYear = +elements[i].getAttribute(DATA_YEAR);
      if (dataYear === year) {
        elements[i].scrollIntoView();
        elements[i].scrollTop = 50 + elements[i].offsetHeight * 2;
        return;
      }
    }
  }
}

export {MDCExtDatePicker, MDCExtDatePickerFoundation,
  MDCExtDatePickerLabel, MDCExtDatePickerLabelFoundation};
