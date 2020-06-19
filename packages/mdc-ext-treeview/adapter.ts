/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { RowState } from './constants';
import { MDCExtTreeviewRowSelectionChangedEventDetail, MDCExtTreeviewToggleChangedEventDetail } from './types';

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCExtTreeviewAdapter {
  /**
   * Adds a CSS class to the root Element.
   */
  addClass(className: string): void;

  /**
   * Returns true if the element contains the given class.
   * @param element target element to verify class name
   * @param className class name
   */
  elementHasClass(element: Element, className: string): boolean;

  /**
   * Gets the value of an attribute on the root element.
   */
  getAttr(attr: string): string | null;

  /**
   * Returns the first (starting at element) inclusive ancestor that matches selectors, and null otherwise.
   */
  getClosest(el: Element, selectors: string): Element | null,

  /**
   * Returns array of children elements for item element.
   */
  getItemChildren(el: Element): Element[],

  /**
   * Returns state of (inner checkbox) item element.
   */
  getItemState(el: Element): RowState | null,

  /**
   * @return true if the root element contains the given CSS class name.
   */
  hasClass(className: string): boolean;

  /**
   * Notifies when row selection is changed.
   *
   * @param data Event detail data for row selection changed event.
   */
  notifyRowSelectionChanged(data: MDCExtTreeviewRowSelectionChangedEventDetail): void;

  /**
   * Notifies when toggle expansion is changed.
   *
   * @param data Event detail data for toggle expansion changed event.
   */
  notifyToggleChanged(data: MDCExtTreeviewToggleChangedEventDetail): void;

  /**
   * Removes an attribute from the root element.
   */
  removeAttr(attr: string): void;

  /**
   * Removes a CSS class from the root Element.
   */
  removeClass(className: string): void;

  /**
   * Sets an attribute on the root element.
   */
  setAttr(attr: string, value: string): void;

  /**
   * Sets disable state to (inner checkbox) item element
   */
  setItemDisabled(el: Element, disabled: boolean): void;

  /**
   * Sets state to (inner checkbox) item element
   * @param el Item element
   * @param rowState state to apply
   */
  setItemState(el: Element, rowState: RowState): void;
}
