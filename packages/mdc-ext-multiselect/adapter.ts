/* eslint-disable no-unused-vars */
import MDCExtMultiselectBottomLineFoundation from './bottom-line/foundation';
import MDCExtMultiselectLabelFoundation from './label/foundation';

/* eslint no-unused-vars: [2, {"args": "none"}] */


/**
 * @typedef {{
 *   value: string,
 *   disabled: boolean,
 *   readOnly: boolean,
 *   validity: {
 *     badInput: boolean,
 *     valid: boolean,
 *   },
 * }}
 */
let NativeInputType;

/**
 * @typedef {{
 *   bottomLine: (!MDCExtMultiselectBottomLineFoundation|undefined),
 *   label: (!MDCExtMultiselectLabelFoundation|undefined),
 * }}
 */
let FoundationMapType;

/**
 * Adapter for MDC Extension Multiselect.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Extension Multiselect into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
export default class MDCExtMultiselectAdapter {
  /**
   * Adds a class to the root element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the root element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Adds a class to the list element.
   * @param {string} className
   */
  addClassToList(className) {}

  /**
   * Removes a class from the root element.
   * @param {string} className
   */
  removeClassFromList(className) {}

  setAttr(attr, value) {}

  removeAttr(attr) {}

  /**
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /** @return {boolean} */
  hasNecessaryDom() {}

  /** @return {boolean} */
  eventTargetInComponent() {}

  /** @return {boolean} */
  eventTargetHasClass(target, className) {}

  /** @return {number} */
  getComboboxElOffsetHeight() {}

  /** @return {number} */
  getComboboxElOffsetTop() {}

  /** @return {number} */
  getComboboxElOffsetWidth() {}

  /**
   * Registers an event listener `handler` for event type `evtType` on the root element.
   * @param {string} evtType
   * @param {!Function} handler
   */
  registerInteractionHandler(evtType, handler) {}

  /**
   * Un-registers an event listener `handler` for event type `evtType` on the root element.
   * @param {string} evtType
   * @param {!Function} handler
   */
  deregisterInteractionHandler(evtType, handler) {}

  /**
   * Registers an event listener on the bottom line element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  registerBottomLineEventHandler(evtType, handler) {}

  /**
   * Deregisters an event listener on the bottom line element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  deregisterBottomLineEventHandler(evtType, handler) {}

  /**
   * Registers an event listener `handler` for a given event on the document.
   * @param {string} evtType
   * @param {!Function} handler
   * @param {boolean} useCapture
   */
  registerDocumentInteractionHandler(evtType, handler, useCapture) {}

  /**
   * Un-registers an event listener `handler` for a given event on the document.
   * @param {string} evtType
   * @param {!Function} handler
   * @param {boolean} useCapture
   */
  deregisterDocumentInteractionHandler(evtType, handler, useCapture) {}

  /**
   * Registers an event listener `handler` for event type `type` on the list element.
   * @param {string} type
   * @param {!Function} handler
   */
  registerListInteractionHandler(type, handler) {}

  /**
   * Un-registers an event listener `handler` for event type `type` on the list element.
   * @param {string} type
   * @param {!Function} handler
   */
  deregisterListInteractionHandler(type, handler) {}

  /**
   * @param {string} value
   * @param {string} description
   * @param {string} rawdata
   */
  addItem(value, description, rawdata) {}

  removeItems() {}

  addSelectedOption(value, description, rawdata) {}

  removeSelectedOption(index) {}

  updateSelectedOption(index, value, description, rawdata) {}

  setListElStyle(propertyName, value) {}

  /** @return {number} */
  getNumberOfSelectedOptions() {}

  /** @return {number} */
  getNumberOfItems() {}

  /** @return {number} */
  getNumberOfAvailableItems() {}

  /** @return {!Array<!Element>} */
  getSelectedOptions() {}

  /** @return {string} */
  getSelectedOptionValue(index) {}

  /** @return {string} */
  getSelectedOptionRawdata(index) {}

  getActiveItem() {}

  /** @return {string} */
  getActiveItemDescription() {}

  /** @return {number} */
  getActiveItemIndex() {}

  /** @return {string} */
  getActiveItemRawdata() {}

  /** @return {string} */
  getActiveItemValue() {}

  setActiveItem(item) {}

  setActiveForItemAtIndex(index) {}

  removeActiveItem() {}

  /** @return {boolean} */
  isActiveItemAvailable() {}

  /** @return {string} */
  getTextForItemAtIndex(index) {}

  /** @return {string} */
  getRawdataForItemAtIndex(index) {}

  /** @return {string} */
  getValueForItemAtIndex(index) {}

  addClassForItemAtIndex(index, className) {}

  rmClassForItemAtIndex(index, className) {}

  setAttrForItemAtIndex(index, attr, value) {}

  rmAttrForItemAtIndex(index, attr) {}

  focusItemAtIndex(index) {}

  scrollActiveItemIntoView() {}

  notifyChange() {}

  setInputAttr(attr, value) {}

  inputFocus() {}

  /** @return {boolean} */
  isInputFocused() {}

  /**
   * Registers an event listener `handler` for event type `type` on the input element.
   * @param {string} type
   * @param {!Function} handler
   */
  registerInputInteractionHandler(type, handler) {}

  /**
   * Un-registers an event listener `handler` for event type `type` on the input element.
   * @param {string} type
   * @param {!Function} handler
   */
  deregisterInputInteractionHandler(type, handler) {}

  getNativeInput() {}
}
