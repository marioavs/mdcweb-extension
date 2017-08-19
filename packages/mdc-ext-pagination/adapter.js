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
   * Adds a class to the previous button element.
   * @param {string} className
   */
  addPrevClass(className) {}

  /**
   * Removes a class from the previous button element.
   * @param {string} className
   */
  removePrevClass(className) {}

  /**
   * Adds a class to the next button element.
   * @param {string} className
   */
  addNextClass(className) {}

  /**
   * Removes a class from the next button element.
   * @param {string} className
   */
  removeNextClass(className) {}

  /**
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /** @return {boolean} */
  hasNecessaryDom() {}

  /**
   * Registers an event listener `handler` for event type `type` on the previous button element.
   * @param {string} type
   * @param {!Function} handler
   */
  registerPrevInteractionHandler(type, handler) {}

  /**
   * Un-registers an event listener `handler` for event type `type` on the previous button element.
   * @param {string} type
   * @param {!Function} handler
   */
  deregisterPrevInteractionHandler(type, handler) {}

  /**
   * Registers an event listener `handler` for event type `type` on the next button element.
   * @param {string} type
   * @param {!Function} handler
   */
  registerNextInteractionHandler(type, handler) {}

  /**
   * Un-registers an event listener `handler` for event type `type` on the next button element.
   * @param {string} type
   * @param {!Function} handler
   */
  deregisterNextInteractionHandler(type, handler) {}

  /** @return {number} */
  getTabIndex() {}

  /** @param {number} tabIndex */
  setTabIndex(tabIndex) {}

  /**
   * @param {string} name
   * @param {string} value
   */
  setAttr(name, value) {}

  /** @param {string} name */
  rmAttr(name) {}

  /**
   * @param {string} name
   * @param {string} value
   */
  setPrevAttr(name, value) {}

  /** @param {string} name */
  rmPrevAttr(name) {}

  /**
   * @param {string} name
   * @param {string} value
   */
  setNextAttr(name, value) {}

  /** @param {string} name */
  rmNextAttr(name) {}

  /** @param {{type: string}} evtData */
  notifyChange(evtData) {}
}
