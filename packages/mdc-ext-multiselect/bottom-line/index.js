/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import MDCExtMultiselectBottomLineAdapter from './adapter';
import MDCExtMultiselectBottomLineFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCExtMultiselectBottomLineFoundation>}
 * @final
 */
class MDCExtMultiselectBottomLine extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCExtMultiselectBottomLine}
   */
  static attachTo(root) {
    return new MDCExtMultiselectBottomLine(root);
  }

  /**
   * @return {!MDCExtMultiselectBottomLineFoundation}
   */
  get foundation() {
    return this.foundation_;
  }

  /**
   * @return {!MDCExtMultiselectBottomLineFoundation}
   */
  getDefaultFoundation() {
    return new MDCExtMultiselectBottomLineFoundation(/** @type {!MDCExtMultiselectBottomLineAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setAttr: (attr, value) => this.root_.setAttribute(attr, value),
      registerEventHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
      notifyAnimationEnd: () => {
        this.emit(MDCExtMultiselectBottomLineFoundation.strings.ANIMATION_END_EVENT, {});
      },
    })));
  }
}

export {MDCExtMultiselectBottomLine, MDCExtMultiselectBottomLineFoundation};
