import MDCSimpleMenuAdapter from './adapter';

/** @record */
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
   * Adds a class to the label element.
   * @param {string} className
   */
  addClassToLabel(className) {}

  /**
   * Removes a class from the label element.
   * @param {string} className
   */
  removeClassFromLabel(className) {}

  /**
   * Adds a class to the helptext element.
   * @param {string} className
   */
  addClassToHelptext(className) {}

  /**
   * Removes a class from the helptext element.
   * @param {string} className
   */
  removeClassFromHelptext(className) {}

  /** @return {boolean} */
  helptextHasClass(className) {}

  setHelptextAttr(attr, value) {}

  removeHelptextAttr(attr) {}

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

  setInputAttr(attr, value) {}

  removeInputAttr(attr) {}

  /**
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /** @return {boolean} */
  hasNecessaryDom() {}

  /** @return {number} */
  getComboboxElOffsetHeight() {}

  /** @return {number} */
  getComboboxElOffsetTop() {}

  /** @return {number} */
  getComboboxElOffsetWidth() {}

  /**
   * Registers an event listener `handler` for event type `type` on the root element.
   * @param {string} type
   * @param {!Function} handler
   */
  registerInteractionHandler(type, handler) {}

  /**
   * Un-registers an event listener `handler` for event type `type` on the root element.
   * @param {string} type
   * @param {!Function} handler
   */
  deregisterInteractionHandler(type, handler) {}

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

  focus() {}

  /** @return {boolean} */
  isFocused() {}

  /** @return {boolean} */
  hasItemsLoader() {}

  applyItemsLoader(query) {}

  addItem(data) {}

  removeItems() {}

  addSelectedOption(value, description) {}

  removeSelectedOption(index) {}

  updateSelectedOption(index, value, description) {}

  setListElStyle(propertyName, value) {}

  /** @return {number} */
  getNumberOfSelectedOptions() {}

  /** @return {number} */
  getNumberOfItems() {}

  /** @return {number} */
  getNumberOfAvailableItems() {}

  /** @return {!Array<!Element>} */
  getSelectedOptions() {}

  getActiveItem() {}

  /** @return {string} */
  getActiveItemDescription() {}

  /** @return {number} */
  getActiveItemIndex() {}

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
  getValueForItemAtIndex(index) {}

  addClassForItemAtIndex(index, className) {}

  rmClassForItemAtIndex(index, className) {}

  setAttrForItemAtIndex(index, attr, value) {}

  rmAttrForItemAtIndex(index, attr) {}

  notifyChange() {}

  getNativeElement() {}

  getNativeInput() {}
}
