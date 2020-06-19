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

export enum RowState {
  CHECKED = 'checked',
  INDETERMINATE = 'indeterminate',
  UNCHECKED = 'unchecked',
}

export const cssClasses = {
  DISABLED: 'mdc-ext-treeview--disabled',
  ROOT: 'mdc-ext-treeview',
  TREEVIEW_TOGGLE: 'mdc-ext-treeview__toggle',
  TREEVIEW_CHECKBOX_NATIVE_CONTROL: 'mdc-ext-treeview__checkbox-native-control',
  TREEVIEW_ITEM: 'mdc-ext-treeview__item',
  TREEVIEW_NODE: 'mdc-ext-treeview__node',
  UPGRADED: 'mdc-ext-treeview--upgraded',
};

export const strings = {
  ARIA_DISABLED: 'aria-disabled',
  CHANGE_EVENT: 'MDCExtTreeview:change',
  CHECKBOX_NATIVE_CONTROL_SELECTOR: '.mdc-ext-treeview__row .mdc-ext-treeview__checkbox-native-control',
  DATA_INDETERMINATE_ATTR: 'data-indeterminate',
  ROW_SELECTION_CHANGED: 'MDCExtTreeview:rowSelectionChanged',
  TAB_INDEX: 'tabindex',
  TOGGLE_CHANGED: 'MDCExtTreeview:toggleChanged',
};
