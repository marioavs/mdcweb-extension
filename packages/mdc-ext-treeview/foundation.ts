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

import { MDCFoundation } from '@material/base/foundation';
import { MDCExtTreeviewAdapter } from './adapter';
import { cssClasses, RowState, strings } from './constants';

export class MDCExtTreeviewFoundation extends MDCFoundation<MDCExtTreeviewAdapter> {

  // private treeState_ = {};
  private disabled_: boolean = false;
  private savedTabIndex_: string | null = null;

  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter(): MDCExtTreeviewAdapter {
    return {
      addClass: () => undefined,
      elementHasClass: () => false,
      hasClass: () => false,
      getAttr: () => null,
      getClosest: () => null,
      getItemChildren: () => [],
      getItemState: () => null,
      notifyRowSelectionChanged: () => undefined,
      notifyToggleChanged: () => undefined,
      removeAttr: () => undefined,
      removeClass: () => undefined,
      setAttr: () => undefined,
      setItemDisabled: () => undefined,
      setItemState: () => undefined,
    };
  }

  constructor(adapter?: Partial<MDCExtTreeviewAdapter>) {
    super({ ...MDCExtTreeviewFoundation.defaultAdapter, ...adapter });
  }

  init() {
    if (!this.adapter_.hasClass(cssClasses.ROOT)) {
      throw new Error(`${cssClasses.ROOT} class required in root element.`);
    }

    this.adapter_.addClass(cssClasses.UPGRADED);
  }

  destroy() {
    this.adapter_.removeClass(cssClasses.UPGRADED);
  }

  setItemDisabled(el: Element, isDisabled: boolean) {
    this.disabled_ = isDisabled;

    if (this.disabled_) {
      this.savedTabIndex_ = this.adapter_.getAttr(strings.TAB_INDEX);
      this.adapter_.setAttr(strings.TAB_INDEX, '-1');
      this.adapter_.setAttr(strings.ARIA_DISABLED, 'true');
      this.adapter_.addClass(cssClasses.DISABLED);
    } else {
      this.adapter_.setAttr(strings.TAB_INDEX, this.savedTabIndex_ ? this.savedTabIndex_ : '-1');
      this.adapter_.removeAttr(strings.ARIA_DISABLED);
      this.adapter_.removeClass(cssClasses.DISABLED);
    }
    this.disableChildren_(el, isDisabled);
  }

  /**
   * Handles change event originated from both node and row checkboxes.
   */
  handleChange(event: Event) {
    const target = event.target as Element;
    if (!target) {
      return;
    }
    if (this.adapter_.elementHasClass(target, cssClasses.TREEVIEW_CHECKBOX_NATIVE_CONTROL)) {
      return this.handleRowCheckboxChange(event);
    } else if (this.adapter_.elementHasClass(target, cssClasses.TREEVIEW_TOGGLE)) {
      return this.handleToggleCheckboxChange(event);
    }
  }

  /**
   * Handles change event originated from row checkboxes.
   */
  handleRowCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target) {
      return;
    }
    let itemElement = this.adapter_.getClosest(target, `.${cssClasses.TREEVIEW_ITEM}`);
    if (!itemElement) {
      return;
    }
    const rowState = this.adapter_.getItemState(itemElement);
    if (rowState == null) {
      return;
    }
    this.updateChildren_(itemElement, rowState);
    this.updateParent_(itemElement!.parentElement, rowState);
    this.adapter_.notifyRowSelectionChanged({ rowId: target.id, rowState });
  }

  /**
   * Handles change event originated from toggle checkboxes.
   */
  handleToggleCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target) {
      return;
    }
    const isExpanded = target.checked;
    this.adapter_.notifyToggleChanged({ nodeId: target.id, isExpanded });
  }

  disableChildren_(element: Element | null, disabled: boolean) {
    if (!element)
      return;
    let children = this.adapter_.getItemChildren(element);
    for (const item of children) {
      this.adapter_.setItemDisabled(item, disabled);
      this.disableChildren_(item, disabled);
    }
  }

  updateChildren_(element: Element | null, rowState: RowState) {
    if (!element)
      return;
    let children = this.adapter_.getItemChildren(element);
    for (const item of children) {
      this.adapter_.setItemState(item, rowState);
      this.updateChildren_(item, rowState);
    }
  }

  updateParent_(element: Element | null, rowState: RowState) {
    if ((!element) || (!this.adapter_.elementHasClass(element, cssClasses.TREEVIEW_NODE))) {
      return;
    }
    let parent = element.parentElement;
    if ((!parent) || (!this.adapter_.elementHasClass(parent, cssClasses.TREEVIEW_ITEM))) {
      return;
    }
    let children = element.parentElement ? this.adapter_.getItemChildren(element.parentElement) : [];
    if (children.length <= 0) {
      return;
    }
    let parentState = rowState;
    for (const item of children) {
      if (this.adapter_.getItemState(item) != rowState) {
        parentState = RowState.INDETERMINATE;
      }
    }
    this.adapter_.setItemState(parent, parentState);
    this.updateParent_(parent.parentElement, parentState);
  }
}