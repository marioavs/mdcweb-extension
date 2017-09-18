/** @record */
export default class MDCExtTreeviewAdapter {
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
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * Registers an event listener `handler` for change event type on checkbox elements.
   * @param {!Function} handler
   */
  registerCheckboxChangeHandler(handler) {}

  /**
   * Un-registers an event listener `handler` for change event type on checkbox elements.
   * @param {string} type
   * @param {!Function} handler
   */
  deregisterCheckboxChangeHandler(handler) {}

  /**
   * Registers an event listener `handler` for change event type on toggle elements.
   * @param {!Function} handler
   */
  registerToggleChangeHandler(handler) {}

  /**
   * Un-registers an event listener `handler` for change event type on toggle elements.
   * @param {string} type
   * @param {!Function} handler
   */
  deregisterToggleChangeHandler(handler) {}

  /** @return {number} */
  getTabIndex() {}

  /** @param {number} tabIndex */
  setTabIndex(tabIndex) {}

  /**
   * @param {string} name
   * @return {string}
   */
  getAttr(name) {}

  /**
   * @param {string} name
   * @param {string} value
   */
  setAttr(name, value) {}

  /** @param {string} name */
  rmAttr(name) {}

  /** @param {{target: !Element}} evtData */
  notifyChange(evtData) {}

  /** @param {{target: !Element}} evtData */
  notifyToggle(evtData) {}
}
