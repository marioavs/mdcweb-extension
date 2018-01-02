import MDCFoundation from '@material/base/foundation';
import MDCExtDatePickerLabelAdapter from './adapter';
import {cssClasses} from './constants';

/**
 * @extends {MDCFoundation<!MDCExtDatePickerLabelAdapter>}
 * @final
 */
class MDCExtDatePickerLabelFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * {@see MDCExtDatePickerLabelAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCExtDatePickerLabelAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCExtDatePickerLabelAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      getWidth: () => {},
    });
  }

  /**
   * @param {!MDCExtDatePickerLabelAdapter=} adapter
   */
  constructor(adapter = /** @type {!MDCExtDatePickerLabelAdapter} */ ({})) {
    super(Object.assign(MDCExtDatePickerLabelFoundation.defaultAdapter, adapter));
  }

  /**
   * Returns the width of the label element when it floats above the text field.
   * @return {number}
   */
  getFloatingWidth() {
    // The label is scaled 75% when it floats above the text field.
    return this.adapter_.getWidth() * 0.75;
  }

  /** Makes the label float above the text field. */
  floatAbove() {
    this.adapter_.addClass(cssClasses.LABEL_FLOAT_ABOVE);
    this.adapter_.removeClass(cssClasses.LABEL_SHAKE);
  }

  /**
   * Deactivates the label's focus state based on whether the text
   * field input is empty and passes validity checks.
   * @param {boolean} shouldRemoveLabelFloat
   */
  deactivateFocus(shouldRemoveLabelFloat) {
    this.adapter_.removeClass(cssClasses.LABEL_SHAKE);

    if (shouldRemoveLabelFloat) {
      this.adapter_.removeClass(cssClasses.LABEL_FLOAT_ABOVE);
    }
  }

  /**
   * Updates the label's valid state based on the supplied validity.
   * @param {boolean} isValid
   */
  setValidity(isValid) {
    if (!isValid) {
      this.adapter_.addClass(cssClasses.LABEL_SHAKE);
    }
  }
}

export default MDCExtDatePickerLabelFoundation;
