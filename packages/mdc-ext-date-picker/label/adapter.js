/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDC Extension Date Picker Label.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Date Picker label into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCExtDatePickerLabelAdapter {
  /**
   * Adds a class to the label element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the label element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Returns the width of the label element.
   * @return {number}
   */
  getWidth() {}
}

export default MDCExtDatePickerLabelAdapter;
