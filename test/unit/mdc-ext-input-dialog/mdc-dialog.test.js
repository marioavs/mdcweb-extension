/**
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

import {assert} from 'chai';
import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';
import {createMockRaf} from '../helpers/raf';
import {strings} from '../../../packages/mdc-ext-input-dialog/constants';
import {MDCExtInputDialog, util} from '../../../packages/mdc-ext-input-dialog';
import {supportsCssVariables} from '@material/ripple/util';

function getFixture() {
  return bel`
    <div class="mdc-ext-input-dialog-anchor">
      <button class="open-dialog">click</button>
      <aside id="the-input-dialog" class="mdc-ext-input-dialog">
        <div class="mdc-ext-input-dialog__surface">
          <header class="mdc-ext-input-dialog__header">
            <h2 class="mdc-ext-input-dialog__header__title">
              Additional input value
            </h2>
          </header>
          <section class="mdc-ext-input-dialog__body">
            <div class="mdc-text-field mdc-text-field--fullwidth">
              <input type="text" class="mdc-text-field__input" placeholder="Additional Value">
              <div class="mdc-line-ripple"></div>
            </div>
          </section>
          <footer class="mdc-ext-input-dialog__footer">
            <button type="button" class="mdc-button mdc-ext-input-dialog__button mdc-ext-input-dialog__button--cancel">Cancel</button>
            <button type="button" class="mdc-button mdc-ext-input-dialog__button mdc-ext-input-dialog__button--accept">Add</button>
          </footer>
        </div>
        <div class="mdc-ext-input-dialog__backdrop"></div>
      </aside>
    </div>`;
}

function setupTest() {
  const fixture = getFixture();
  const openDialog = fixture.querySelector('.open-dialog');
  const root = fixture.querySelector('.mdc-ext-input-dialog');
  const component = new MDCExtInputDialog(root);
  const acceptButton = fixture.querySelector('.mdc-ext-input-dialog__button--accept');
  const cancelButton = fixture.querySelector('.mdc-ext-input-dialog__button--cancel');
  return {openDialog, root, acceptButton, cancelButton, component};
}

function hasClassMatcher(className) {
  return td.matchers.argThat((el) => el.classList && el.classList.contains(className));
}

suite('MDCExtInputDialog');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCExtInputDialog.attachTo(getFixture().querySelector('.mdc-ext-input-dialog')) instanceof MDCExtInputDialog);
});

if (supportsCssVariables(window)) {
  test('#initialize attaches ripple elements to all footer buttons', () => {
    const raf = createMockRaf();
    const {acceptButton, cancelButton} = setupTest();
    raf.flush();

    assert.isTrue(acceptButton.classList.contains('mdc-ripple-upgraded'));
    assert.isTrue(cancelButton.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });

  test('#destroy cleans up all ripples on footer buttons', () => {
    const raf = createMockRaf();
    const {component, acceptButton, cancelButton} = setupTest();
    raf.flush();

    component.destroy();
    raf.flush();

    assert.isFalse(acceptButton.classList.contains('mdc-ripple-upgraded'));
    assert.isFalse(cancelButton.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });
}

test('#show opens the dialog', () => {
  const {component} = setupTest();

  component.show();
  const wasOpen = component.open;
  // Deactivate focus trapping, preventing other tests that use focus from failing
  component.destroy();
  assert.isTrue(wasOpen);
});

test('#close hides the dialog', () => {
  const {component} = setupTest();

  component.close();
  assert.isFalse(component.open);
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(root.classList.contains('foo'));
});

test('adapter#registerInteractionHandler adds an event listener to the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', handler);
  domEvents.emit(root, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterInteractionHandler removes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');
  root.addEventListener('click', handler);

  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', handler);
  domEvents.emit(root, 'click');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerSurfaceInteractionHandler adds an event listener to the root element', () => {
  const {root, component} = setupTest();
  const dialog = root.querySelector(strings.DIALOG_SURFACE_SELECTOR);
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerSurfaceInteractionHandler('click', handler);
  domEvents.emit(dialog, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterSurfaceInteractionHandler removes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const dialog = root.querySelector(strings.DIALOG_SURFACE_SELECTOR);
  const handler = td.func('eventHandler');

  dialog.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterSurfaceInteractionHandler('click', handler);
  domEvents.emit(dialog, 'click');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerDocumentKeydownHandler attaches a "keydown" handler to the document', () => {
  const {component} = setupTest();
  const handler = td.func('keydownHandler');

  component.getDefaultFoundation().adapter_.registerDocumentKeydownHandler(handler);
  domEvents.emit(document, 'keydown');
  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterDocumentKeydownHandler removes a "keydown" handler from the document', () => {
  const {component} = setupTest();
  const handler = td.func('keydownHandler');

  document.addEventListener('keydown', handler);
  component.getDefaultFoundation().adapter_.deregisterDocumentKeydownHandler(handler);
  domEvents.emit(document, 'keydown');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerTransitionEndHandler adds a transition end event listener on the dialog element', () => {
  const {root, component} = setupTest();
  const surface = root.querySelector(strings.DIALOG_SURFACE_SELECTOR);
  const handler = td.func('transitionEndHandler');
  component.getDefaultFoundation().adapter_.registerTransitionEndHandler(handler);
  domEvents.emit(surface, 'transitionend');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterTransitionEndHandler removes a transition end event listener on the dialog element', () => {
  const {root, component} = setupTest();
  const surface = root.querySelector(strings.DIALOG_SURFACE_SELECTOR);
  const handler = td.func('transitionEndHandler');
  surface.addEventListener('transitionend', handler);

  component.getDefaultFoundation().adapter_.deregisterTransitionEndHandler(handler);
  domEvents.emit(surface, 'transitionend');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#eventTargetHasClass returns whether or not the className is in the target\'s classList', () => {
  const {component} = setupTest();
  const target = bel`<div class="existent-class"></div>`;
  const {adapter_: adapter} = component.getDefaultFoundation();

  assert.isTrue(adapter.eventTargetHasClass(target, 'existent-class'));
  assert.isFalse(adapter.eventTargetHasClass(target, 'non-existent-class'));
});

test(`adapter#notifyAccept emits ${strings.ACCEPT_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('acceptHandler');

  component.listen(strings.ACCEPT_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyAccept();

  td.verify(handler(td.matchers.anything()));
});

test(`adapter#notifyCancel emits ${strings.CANCEL_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('cancelHandler');

  component.listen(strings.CANCEL_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyCancel();

  td.verify(handler(td.matchers.anything()));
});

// Webpack 4 is not generating setters https://github.com/webpack/webpack/issues/6979

// test('adapter#trapFocusOnSurface calls activate() on a properly configured focus trap instance', () => {
//   const {createFocusTrapInstance} = util;
//   util.createFocusTrapInstance = td.func('util.createFocusTrapInstance');
//
//   const fakeFocusTrapInstance = td.object({
//     activate: () => {},
//     deactivate: () => {},
//   });
//   td.when(
//     util.createFocusTrapInstance(
//       hasClassMatcher('mdc-ext-input-dialog__surface'),
//       hasClassMatcher('mdc-ext-input-dialog__button--accept')
//     )
//   ).thenReturn(fakeFocusTrapInstance);
//
//   const {component} = setupTest();
//   component.getDefaultFoundation().adapter_.trapFocusOnSurface();
//   util.createFocusTrapInstance = createFocusTrapInstance;
//
//   td.verify(fakeFocusTrapInstance.activate());
// });
//
// test('adapter#untrapFocusOnSurface calls deactivate() on a properly configured focus trap instance', () => {
//   const {createFocusTrapInstance} = util;
//   util.createFocusTrapInstance = td.func('util.createFocusTrapInstance');
//
//   const fakeFocusTrapInstance = td.object({
//     activate: () => {},
//     deactivate: () => {},
//   });
//   td.when(
//     util.createFocusTrapInstance(
//       hasClassMatcher('mdc-ext-input-dialog__surface'),
//       hasClassMatcher('mdc-ext-input-dialog__button--accept')
//     )
//   ).thenReturn(fakeFocusTrapInstance);
//
//   const {component} = setupTest();
//   component.getDefaultFoundation().adapter_.untrapFocusOnSurface();
//   util.createFocusTrapInstance = createFocusTrapInstance;
//
//   td.verify(fakeFocusTrapInstance.deactivate());
// });

test('adapter#isInputDialog returns true for the dialog surface element', () => {
  const {root, component} = setupTest();
  const dialog = root.querySelector(strings.DIALOG_SURFACE_SELECTOR);
  assert.isOk(component.getDefaultFoundation().adapter_.isInputDialog(dialog));
});

test('adapter#isInputDialog returns false for a non-dialog surface element', () => {
  const {root, component} = setupTest();
  assert.isNotOk(component.getDefaultFoundation().adapter_.isInputDialog(root));
});
