/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import {MDCComponent} from '@material/base/index';
import {MDCRipple} from '@material/ripple/index';

import {MDCExtInputDialogFoundation} from './foundation';
import {Corner} from './constants';
import * as util from './util';

/**
 * @extends {MDCComponent<!MDCExtInputDialogFoundation>}
 * @final
 */
class MDCExtInputDialog extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?Element} */
    this.surfaceEl_;
    /** @private {?Object} */
    this.focusTrap_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCExtInputDialog}
   */
  static attachTo(root) {
    return new MDCExtInputDialog(root);
  }

  get open() {
    return this.foundation_.isOpen();
  }

  get acceptButton_() {
    return this.root_.querySelector(MDCExtInputDialogFoundation.strings.ACCEPT_SELECTOR);
  }

  initialize() {
    this.surfaceEl_ = this.root_.querySelector(MDCExtInputDialogFoundation.strings.DIALOG_SURFACE_SELECTOR);
    this.focusTrap_ = util.createFocusTrapInstance(this.surfaceEl_, this.acceptButton_);
    this.footerBtnRipples_ = [];

    const footerBtns = this.root_.querySelectorAll(MDCExtInputDialogFoundation.strings.BUTTONS_SELECTOR);
    for (let i = 0, footerBtn; footerBtn = footerBtns[i]; i++) {
      this.footerBtnRipples_.push(new MDCRipple(footerBtn));
    }
  }

  destroy() {
    this.footerBtnRipples_.forEach((ripple) => ripple.destroy());
    super.destroy();
  }

  show() {
    this.foundation_.open();
  }

  close() {
    this.foundation_.close();
  }

  /**
   * @param {Corner} corner Default anchor corner alignment of top-left
   *     surface corner.
   */
  setAnchorCorner(corner) {
    this.foundation_.setAnchorCorner(corner);
  }

  getDefaultFoundation() {
    return new MDCExtInputDialogFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      addBodyClass: (className) => document.body.classList.add(className),
      removeBodyClass: (className) => document.body.classList.remove(className),
      hasNecessaryDom: () => Boolean(this.surfaceEl_),
      getInnerDimensions: () => {
        if (!this.surfaceEl_) return {width: 0, height: 0};
        return {width: this.surfaceEl_.offsetWidth, height: this.surfaceEl_.offsetHeight};
      },
      hasAnchor: () => this.root_.parentElement && this.root_.parentElement.classList.contains(MDCExtInputDialogFoundation.cssClasses.ANCHOR),
      getAnchorDimensions: () => this.root_.parentElement.getBoundingClientRect(),
      getWindowDimensions: () => {
        return {width: window.innerWidth, height: window.innerHeight};
      },
      eventTargetHasClass: (target, className) => target.classList.contains(className),
      registerInteractionHandler: (evt, handler) => this.root_.addEventListener(evt, handler),
      deregisterInteractionHandler: (evt, handler) => this.root_.removeEventListener(evt, handler),
      registerSurfaceInteractionHandler: (evt, handler) => this.surfaceEl_.addEventListener(evt, handler),
      deregisterSurfaceInteractionHandler: (evt, handler) => this.surfaceEl_.removeEventListener(evt, handler),
      registerDocumentKeydownHandler: (handler) => document.addEventListener('keydown', handler),
      deregisterDocumentKeydownHandler: (handler) => document.removeEventListener('keydown', handler),
      registerTransitionEndHandler: (handler) => this.surfaceEl_.addEventListener('transitionend', handler),
      deregisterTransitionEndHandler: (handler) => this.surfaceEl_.removeEventListener('transitionend', handler),
      isRtl: () => getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
      setPosition: (position) => {
        this.surfaceEl_.style.position = 'position' in position ? position.position : null;
        this.surfaceEl_.style.left = 'left' in position ? position.left : null;
        this.surfaceEl_.style.right = 'right' in position ? position.right : null;
        this.surfaceEl_.style.top = 'top' in position ? position.top : null;
        this.surfaceEl_.style.bottom = 'bottom' in position ? position.bottom : null;
      },
      notifyAccept: () => this.emit(MDCExtInputDialogFoundation.strings.ACCEPT_EVENT),
      notifyCancel: () => this.emit(MDCExtInputDialogFoundation.strings.CANCEL_EVENT),
      trapFocusOnSurface: () => this.focusTrap_.activate(),
      untrapFocusOnSurface: () => this.focusTrap_.deactivate(),
      isInputDialog: (el) => el === this.surfaceEl_,
    });
  }
}

export {MDCExtInputDialogFoundation, MDCExtInputDialog, Corner};
