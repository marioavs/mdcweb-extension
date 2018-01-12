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
   * Returns the width of the label element.
   * @return {number}
   */
  getWidth() {
    // The label is scaled 75% when it floats above the text field.
    return this.adapter_.getWidth() * 0.75;
  }

  /**
   * Styles the label to produce the label shake for errors.
   * @param {boolean} isValid Whether the input's value is valid (passes all
   *     validity checks).
   * @param {boolean} isFocused Whether the input is focused.
   */
  styleShake(isValid, isFocused) {
    const {LABEL_SHAKE} = cssClasses;
    if (isValid || isFocused) {
      this.adapter_.removeClass(LABEL_SHAKE);
    } else {
      this.adapter_.addClass(LABEL_SHAKE);
    }
  }

  /**
   * Styles the label to float or defloat as necessary.
   * @param {string} value The value of the input.
   * @param {boolean} isFocused Whether the input is focused.
   * @param {boolean} isBadInput The input's `validity.badInput` value.
   */
  styleFloat(value, isFocused, isBadInput) {
    const {LABEL_FLOAT_ABOVE} = cssClasses;
    if (!!value || isFocused) {
      this.adapter_.addClass(LABEL_FLOAT_ABOVE);
    } else if (!isBadInput) {
      this.adapter_.removeClass(LABEL_FLOAT_ABOVE);
    }
  }
}

export default MDCExtDatePickerLabelFoundation;
