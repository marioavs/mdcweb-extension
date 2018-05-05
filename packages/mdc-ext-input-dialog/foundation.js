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

import MDCFoundation from '@material/base/foundation';
import {MDCExtInputDialogAdapter} from './adapter';
import {cssClasses, strings, numbers, Corner, CornerBit} from './constants';

/**
 * @typedef {{
 *   top: number,
 *   right: number,
 *   bottom: number,
 *   left: number
 * }}
 */
let AnchorMargin;

/* eslint-disable no-unused-vars */
/**
 * @typedef {{
 *   viewport: { width: number, height: number },
 *   viewportDistance: {top: number, right: number, bottom: number, left: number},
 *   anchorHeight: number,
 *   anchorWidth: number,
 *   surfaceHeight: number,
 *   surfaceWidth: number,
 * }}
 */
let AutoLayoutMeasurements;
/* eslint-enable no-unused-vars */

/**
 * @extends {MDCFoundation<!MDCExtInputDialogAdapter>}
 */
class MDCExtInputDialogFoundation extends MDCFoundation {
  /** @return enum{cssClasses} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum{strings} */
  static get strings() {
    return strings;
  }

  /** @return enum{numbers} */
  static get numbers() {
    return numbers;
  }

  /** @return enum{number} */
  static get Corner() {
    return Corner;
  }

  /**
   * {@see MDCExtInputDialogAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCExtInputDialogAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCExtInputDialogAdapter} */ ({
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      hasClass: (/* className: string */) => false,
      addBodyClass: (/* className: string */) => {},
      removeBodyClass: (/* className: string */) => {},
      hasNecessaryDom: () => false,
      getInnerDimensions: () => ({}),
      hasAnchor: () => false,
      getAnchorDimensions: () => ({}),
      getWindowDimensions: () => ({}),
      eventTargetHasClass: (/* target: EventTarget, className: string */) => /* boolean */ false,
      registerInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      registerSurfaceInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      deregisterSurfaceInteractionHandler: (/* evt: string, handler: EventListener */) => {},
      registerDocumentKeydownHandler: (/* handler: EventListener */) => {},
      deregisterDocumentKeydownHandler: (/* handler: EventListener */) => {},
      registerTransitionEndHandler: (/* handler: EventListener */) => {},
      deregisterTransitionEndHandler: (/* handler: EventListener */) => {},
      isRtl: () => false,
      setPosition: () => {},
      notifyAccept: () => {},
      notifyCancel: () => {},
      trapFocusOnSurface: () => {},
      untrapFocusOnSurface: () => {},
      isInputDialog: (/* el: Element */) => /* boolean */ false,
    });
  }

  /** @param {!MDCExtInputDialogAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCExtInputDialogFoundation.defaultAdapter, adapter));
    /** @private {boolean} */
    this.isOpen_ = false;
    /** @private {Corner} */
    this.anchorCorner_ = Corner.TOP_START;
    /** @private {AnchorMargin} */
    this.anchorMargin_ = {top: 0, right: 0, bottom: 0, left: 0};
    /** @private {?AutoLayoutMeasurements} */
    this.measures_ = null;
    this.componentClickHandler_ = (evt) => {
      if (this.adapter_.eventTargetHasClass(evt.target, cssClasses.BACKDROP)) {
        this.cancel(true);
      }
    };
    this.inputDialogClickHandler_ = (evt) => this.handleInputDialogClick_(evt);
    this.documentKeydownHandler_ = (evt) => {
      if (evt.key && evt.key === 'Escape' || evt.keyCode === 27) {
        this.cancel(true);
      }
    };
    this.transitionEndHandler_ = (evt) => this.handleTransitionEnd_(evt);
  };

  init() {
    const {ROOT, OPEN} = cssClasses;

    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (!this.adapter_.hasNecessaryDom()) {
      throw new Error(`Required DOM nodes missing in ${ROOT} component.`);
    }

    if (this.adapter_.hasClass(OPEN)) {
      this.isOpen_ = true;
    }
  }

  destroy() {
    // Ensure that input dialog is cleaned up when destroyed
    if (this.isOpen_) {
      this.adapter_.deregisterSurfaceInteractionHandler('click', this.inputDialogClickHandler_);
      this.adapter_.deregisterDocumentKeydownHandler(this.documentKeydownHandler_);
      this.adapter_.deregisterInteractionHandler('click', this.componentClickHandler_);
      this.adapter_.untrapFocusOnSurface();
      this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
      this.adapter_.removeClass(cssClasses.ANIMATING);
      this.adapter_.removeClass(cssClasses.OPEN);
    }
  }

  /** @return enum{number} */
  static get Corner() {
    return Corner;
  }

  /**
   * @param {!Corner} corner Default anchor corner alignment of top-left surface corner.
   */
  setAnchorCorner(corner) {
    this.anchorCorner_ = corner;
  }

  /**
   * @return {AutoLayoutMeasurements} Measurements used to position surface popup.
   */
  getAutoLayoutMeasurements_() {
    const anchorRect = this.adapter_.getAnchorDimensions();
    const viewport = this.adapter_.getWindowDimensions();
    const dimensions = this.adapter_.getInnerDimensions();

    return {
      viewport: viewport,
      viewportDistance: {
        top: anchorRect.top,
        right: viewport.width - anchorRect.right,
        left: anchorRect.left,
        bottom: viewport.height - anchorRect.bottom,
      },
      anchorHeight: anchorRect.height,
      anchorWidth: anchorRect.width,
      surfaceHeight: dimensions.height,
      surfaceWidth: dimensions.width,
    };
  }

  /**
   * Computes the corner of the anchor from which to position the surface.
   * @return {Corner}
   * @private
   */
  getOriginCorner_() {
    // Defaults: open from the top left.
    let corner = Corner.TOP_LEFT;

    if (this.anchorCorner_ & CornerBit.FIXED_CENTER)
      return Corner.FIXED_CENTER;
    const {viewportDistance, anchorHeight, anchorWidth, surfaceHeight, surfaceWidth} = this.measures_;
    const isBottomAligned = Boolean(this.anchorCorner_ & CornerBit.BOTTOM);
    const availableTop = isBottomAligned ? viewportDistance.top + anchorHeight + this.anchorMargin_.bottom :
      viewportDistance.top + this.anchorMargin_.top;
    const availableBottom = isBottomAligned ? viewportDistance.bottom - this.anchorMargin_.bottom :
      viewportDistance.bottom + anchorHeight - this.anchorMargin_.top;

    const topOverflow = surfaceHeight - availableTop;
    const bottomOverflow = surfaceHeight - availableBottom;
    if (bottomOverflow > 0 && topOverflow < bottomOverflow) {
      corner |= CornerBit.BOTTOM;
    }

    const isRtl = this.adapter_.isRtl();
    const isFlipRtl = Boolean(this.anchorCorner_ & CornerBit.FLIP_RTL);
    const avoidHorizontalOverlap = Boolean(this.anchorCorner_ & CornerBit.RIGHT);
    const isAlignedRight = (avoidHorizontalOverlap && !isRtl) ||
      (!avoidHorizontalOverlap && isFlipRtl && isRtl);
    const availableLeft = isAlignedRight ? viewportDistance.left + anchorWidth + this.anchorMargin_.right :
      viewportDistance.left + this.anchorMargin_.left;
    const availableRight = isAlignedRight ? viewportDistance.right - this.anchorMargin_.right :
      viewportDistance.right + anchorWidth - this.anchorMargin_.left;

    const leftOverflow = surfaceWidth - availableLeft;
    const rightOverflow = surfaceWidth - availableRight;

    if ((leftOverflow < 0 && isAlignedRight && isRtl) ||
       (avoidHorizontalOverlap && !isAlignedRight && leftOverflow < 0) ||
       (rightOverflow > 0 && leftOverflow < rightOverflow)) {
      corner |= CornerBit.RIGHT;
    }

    return corner;
  }

  /**
   * @param {Corner} corner Origin corner of the surface.
   * @return {number} Horizontal offset of surface origin corner from corresponding anchor corner.
   * @private
   */
  getHorizontalOriginOffset_(corner) {
    const {anchorWidth} = this.measures_;
    const isRightAligned = Boolean(corner & CornerBit.RIGHT);
    const avoidHorizontalOverlap = Boolean(this.anchorCorner_ & CornerBit.RIGHT);
    let x = 0;
    if (isRightAligned) {
      const rightOffset = avoidHorizontalOverlap ? anchorWidth - this.anchorMargin_.left : this.anchorMargin_.right;
      x = rightOffset;
    } else {
      const leftOffset = avoidHorizontalOverlap ? anchorWidth - this.anchorMargin_.right : this.anchorMargin_.left;
      x = leftOffset;
    }
    return x;
  }

  /**
   * @param {Corner} corner Origin corner of the surface.
   * @return {number} Vertical offset of surface origin corner from corresponding anchor corner.
   * @private
   */
  getVerticalOriginOffset_(corner) {
    const {viewport, viewportDistance, anchorHeight, surfaceHeight} = this.measures_;
    const isBottomAligned = Boolean(corner & CornerBit.BOTTOM);
    const {MARGIN_TO_EDGE} = numbers;
    const avoidVerticalOverlap = Boolean(this.anchorCorner_ & CornerBit.BOTTOM);
    const canOverlapVertically = !avoidVerticalOverlap;
    let y = 0;

    if (isBottomAligned) {
      y = avoidVerticalOverlap ? anchorHeight - this.anchorMargin_.top : -this.anchorMargin_.bottom;
      // adjust for when surface can overlap anchor, but too tall to be aligned to bottom
      // anchor corner. Bottom margin is ignored in such cases.
      if (canOverlapVertically && surfaceHeight > viewportDistance.top + anchorHeight) {
        y = -(Math.min(surfaceHeight, viewport.height - MARGIN_TO_EDGE) - (viewportDistance.top + anchorHeight));
      }
    } else {
      y = avoidVerticalOverlap ? (anchorHeight + this.anchorMargin_.bottom) : this.anchorMargin_.top;
      // adjust for when surface can overlap anchor, but too tall to be aligned to top
      // anchor corners. Top margin is ignored in that case.
      if (canOverlapVertically && surfaceHeight > viewportDistance.bottom + anchorHeight) {
        y = -(Math.min(surfaceHeight, viewport.height - MARGIN_TO_EDGE) - (viewportDistance.bottom + anchorHeight));
      }
    }
    return y;
  }

  /** @private */
  autoPosition_() {
    if (!this.adapter_.hasAnchor()) {
      return;
    }

    // Compute measurements for autoposition methods reuse.
    this.measures_ = this.getAutoLayoutMeasurements_();

    const corner = this.getOriginCorner_();
    let verticalAlignment = (corner & CornerBit.BOTTOM) ? 'bottom' : 'top';
    let horizontalAlignment = (corner & CornerBit.RIGHT) ? 'right' : 'left';
    const horizontalOffset = this.getHorizontalOriginOffset_(corner);
    const verticalOffset = this.getVerticalOriginOffset_(corner);
    const position = {
      [horizontalAlignment]: horizontalOffset ? horizontalOffset + 'px' : '0',
      [verticalAlignment]: verticalOffset ? verticalOffset + 'px' : '0',
    };
    const {viewport, surfaceHeight, surfaceWidth} = this.measures_;
    if (corner & CornerBit.FIXED_CENTER) {
      let left = 0;
      let top = 0;
      if (viewport) {
        left = Math.round((viewport.width - surfaceWidth) / 2);
        top = Math.round((viewport.height - surfaceHeight) / 2);
      }
      position.position = 'fixed';
      delete position.bottom;
      delete position.right;
      position.left = left + 'px';
      position.top = top + 'px';
    } else {
      position.position = 'absolute';
    }

    this.adapter_.setPosition(position);

    // Clear measures after positioning is complete.
    this.measures_ = null;
  }

  /**
   * Open the surface.
   */
  open() {
    this.isOpen_ = true;
    this.autoPosition_();
    this.adapter_.registerDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.registerSurfaceInteractionHandler('click', this.inputDialogClickHandler_);
    this.adapter_.registerInteractionHandler('click', this.componentClickHandler_);
    this.adapter_.registerTransitionEndHandler(this.transitionEndHandler_);
    this.adapter_.addClass(cssClasses.ANIMATING);
    this.adapter_.addClass(cssClasses.OPEN);
  }

  close() {
    this.isOpen_ = false;
    this.adapter_.deregisterSurfaceInteractionHandler('click', this.inputDialogClickHandler_);
    this.adapter_.deregisterDocumentKeydownHandler(this.documentKeydownHandler_);
    this.adapter_.deregisterInteractionHandler('click', this.componentClickHandler_);
    this.adapter_.untrapFocusOnSurface();
    this.adapter_.registerTransitionEndHandler(this.transitionEndHandler_);
    this.adapter_.addClass(cssClasses.ANIMATING);
    this.adapter_.removeClass(cssClasses.OPEN);
  }

  isOpen() {
    return this.isOpen_;
  }

  accept(shouldNotify) {
    if (shouldNotify) {
      this.adapter_.notifyAccept();
    }

    this.close();
  }

  cancel(shouldNotify) {
    if (shouldNotify) {
      this.adapter_.notifyCancel();
    }

    this.close();
  }

  handleInputDialogClick_(evt) {
    const {target} = evt;
    if (this.adapter_.eventTargetHasClass(target, cssClasses.ACCEPT_BTN)) {
      this.accept(true);
    } else if (this.adapter_.eventTargetHasClass(target, cssClasses.CANCEL_BTN)) {
      this.cancel(true);
    }
  }

  handleTransitionEnd_(evt) {
    if (this.adapter_.isInputDialog(evt.target)) {
      this.adapter_.deregisterTransitionEndHandler(this.transitionEndHandler_);
      this.adapter_.removeClass(cssClasses.ANIMATING);
      if (this.isOpen_) {
        this.adapter_.trapFocusOnSurface();
      };
    };
  };

  disableScroll_() {
    this.adapter_.addBodyClass(cssClasses.SCROLL_LOCK);
  }

  enableScroll_() {
    this.adapter_.removeBodyClass(cssClasses.SCROLL_LOCK);
  }
}

export default MDCExtInputDialogFoundation;
