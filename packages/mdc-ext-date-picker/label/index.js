import MDCComponent from '@material/base/component';
import MDCExtDatePickerLabelAdapter from './adapter';
import MDCExtDatePickerLabelFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCExtDatePickerLabelFoundation>}
 * @final
 */
class MDCExtDatePickerLabel extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCExtDatePickerLabel}
   */
  static attachTo(root) {
    return new MDCExtDatePickerLabel(root);
  }

  /**
   * @return {!MDCExtDatePickerLabelFoundation}.
   */
  get foundation() {
    return this.foundation_;
  }

  /**
   * @return {!MDCExtDatePickerLabelFoundation}
   */
  getDefaultFoundation() {
    return new MDCExtDatePickerLabelFoundation(/** @type {!MDCExtDatePickerLabelAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      getWidth: () => this.root_.offsetWidth,
    })));
  }
}

export {MDCExtDatePickerLabel, MDCExtDatePickerLabelFoundation};
