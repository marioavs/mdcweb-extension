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

import { MDCComponent } from '@material/base/component';
import { SpecificEventListener } from '@material/base/types';

import { MDCExtTreeviewAdapter } from './adapter';
import { strings, RowState, cssClasses } from './constants';
import { MDCExtTreeviewFoundation } from './foundation';
import { MDCExtTreeviewRowSelectionChangedEventDetail, MDCExtTreeviewToggleChangedEventDetail } from './types';

export class MDCExtTreeview extends MDCComponent<MDCExtTreeviewFoundation> {
  static attachTo(root: Element) {
    return new MDCExtTreeview(root);
  }

  private handleChange!: SpecificEventListener<'change'>; // assigned in initialSyncWithDOM()

  initialSyncWithDOM() {
    this.handleChange = (event) => this.foundation_.handleChange(event);
    this.listen('change', this.handleChange);

    let items = this.root_.querySelectorAll(`.${cssClasses.TREEVIEW_ITEM}`);
    for (const item of Array.from(items)) {
      let nativeCb = item.querySelector<HTMLInputElement>(strings.CHECKBOX_NATIVE_CONTROL_SELECTOR);
      if (!nativeCb) {
        continue;
      }
      nativeCb.indeterminate = nativeCb.getAttribute(strings.DATA_INDETERMINATE_ATTR) === 'true';
      nativeCb.removeAttribute(strings.DATA_INDETERMINATE_ATTR);
    }
  }

  destroy() {
    this.unlisten('change', this.handleChange);
    super.destroy();
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCExtTreeviewAdapter = {
      addClass: (className) => this.root_.classList.add(className),
      elementHasClass: (element, className) =>
        element.classList.contains(className),
      getAttr: (attrName) => this.root_.getAttribute(attrName),
      getClosest: (el, selectors) => el.closest(selectors),
      getItemChildren: (el) => this.getItemChildren_(el),
      getItemState: (el) => this.getItemState_(el),
      hasClass: (className) => this.root_.classList.contains(className),
      notifyRowSelectionChanged: (data: MDCExtTreeviewRowSelectionChangedEventDetail) => {
        this.emit(strings.ROW_SELECTION_CHANGED, {
          rowId: data.rowId,
          rowState: data.rowState,
        },
        /** shouldBubble */ true);
      },
      notifyToggleChanged: (data: MDCExtTreeviewToggleChangedEventDetail) => {
        this.emit(strings.TOGGLE_CHANGED, {
          nodeId: data.nodeId,
          isExpandes: data.isExpanded
        },
        /** shouldBubble */ true);
      },
      removeAttr: (attr) => this.root_.removeAttribute(attr),
      removeClass: (className) => this.root_.classList.remove(className),
      setAttr: (attrName, attrValue) =>
        this.root_.setAttribute(attrName, attrValue),
      setItemDisabled: (el, disabled) => this.setItemDisabled(el, disabled),
      setItemState: (el, rowState) => this.setItemState_(el, rowState),
    };
    return new MDCExtTreeviewFoundation(adapter);
  }

  get treeStateArray() {
    let treeStateArray = [];
    let items = this.root_.querySelectorAll<HTMLInputElement>(`.${cssClasses.TREEVIEW_ITEM}`);
    for (const item of Array.from(items)) {
      let id = item.id || item.getAttribute('name');
      treeStateArray.push({
        id,
        state: this.getItemState_(item)
      })
    }
    return treeStateArray;
  }

  setItemDisabled(el: Element, isDisabled: boolean) {
    this.foundation_.setItemDisabled(el, isDisabled);
  }

  getItemChildren_(itemElement: Element): Element[] {
    let result: Element[] = [];
    let node = null;
    for (const el of Array.from(itemElement.children)) {
      if (el.classList.contains(cssClasses.TREEVIEW_NODE)) {
        node = el;
        break;
      }
    }
    if (!node){
      return result;
    }
    for (const el of Array.from(node.children)) {
      if (el.classList.contains(cssClasses.TREEVIEW_ITEM)) {
        result.push(el);
      }
    }
    return result;
  }

  getItemState_(itemElement: Element): RowState | null {
    if (!itemElement) {
      return null;
    }
    let nativeCb = itemElement.querySelector<HTMLInputElement>(strings.CHECKBOX_NATIVE_CONTROL_SELECTOR);
    if (!nativeCb) {
      return null;
    }
    if (nativeCb.indeterminate) {
      return RowState.INDETERMINATE;
    }
    return nativeCb.checked ? RowState.CHECKED : RowState.UNCHECKED;
  }

  setItemState_(itemElement: Element, rowState: RowState) {
    let nativeCb = itemElement.querySelector<HTMLInputElement>(strings.CHECKBOX_NATIVE_CONTROL_SELECTOR);
    if (!nativeCb)
      return;
    if (rowState === RowState.INDETERMINATE)
      nativeCb.indeterminate = true;
    else {
      nativeCb.indeterminate = false;
      nativeCb.checked = (rowState === RowState.CHECKED);
    }
  }
}  