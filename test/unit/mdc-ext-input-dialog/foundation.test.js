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
 * See the License for the specific language governing permissions and * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter, captureHandlers} from '../helpers/foundation';

import {cssClasses} from '../../../packages/mdc-ext-input-dialog/constants';
import MDCExtInputDialogFoundation from '../../../packages/mdc-ext-input-dialog/foundation';

suite('MDCExtInputDialogFoundation');

test('exports cssClasses', () => {
  assert.isTrue('cssClasses' in MDCExtInputDialogFoundation);
});

test('exports strings', () => {
  assert.isTrue('strings' in MDCExtInputDialogFoundation);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCExtInputDialogFoundation, [
    'addClass', 'removeClass', 'hasClass', 'addBodyClass', 'removeBodyClass',
    'hasNecessaryDom', 'getInnerDimensions', 'hasAnchor', 'getAnchorDimensions',
    'getWindowDimensions', 'eventTargetHasClass',
    'registerInteractionHandler', 'deregisterInteractionHandler',
    'registerSurfaceInteractionHandler', 'deregisterSurfaceInteractionHandler',
    'registerDocumentKeydownHandler', 'deregisterDocumentKeydownHandler',
    'registerTransitionEndHandler', 'deregisterTransitionEndHandler', 'isRtl',
    'setPosition', 'notifyAccept', 'notifyCancel', 'trapFocusOnSurface',
    'untrapFocusOnSurface', 'isInputDialog',
  ]);
});

function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCExtInputDialogFoundation);
  td.when(mockAdapter.hasClass('mdc-ext-input-dialog')).thenReturn(true);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(true);
  return {foundation, mockAdapter};
}

test('#destroy closes the input dialog to perform any necessary cleanup', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.open();
  foundation.destroy();

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

test('#isOpen returns true when the input dialog is open', () => {
  const {foundation} = setupTest();

  foundation.open();
  assert.isTrue(foundation.isOpen());
});

test('#isOpen returns false when the input dialog is closed', () => {
  const {foundation} = setupTest();

  foundation.close();
  assert.isFalse(foundation.isOpen());
});

test('#isOpen returns false when the input dialog is closed after being open', () => {
  const {foundation} = setupTest();
  foundation.open();
  foundation.close();
  assert.isFalse(foundation.isOpen());
});

test('#open registers all events registered within open()', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();

  td.verify(mockAdapter.registerSurfaceInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('click', td.matchers.isA(Function)));
});

test('#close deregisters all events registered within open()', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();

  td.verify(mockAdapter.deregisterSurfaceInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterDocumentKeydownHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('click', td.matchers.isA(Function)));
});

test('#open adds the open class to reveal the input dialog', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.verify(mockAdapter.addClass(cssClasses.OPEN));
});

test('#close removes the open class to hide the input dialog', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

test('#open adds the animation class to start an animation', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();

  td.verify(mockAdapter.addClass(cssClasses.ANIMATING));
});

test('#open activates focus trapping on the input dialog surface', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.registerTransitionEndHandler(td.callback)).thenCallback({target: {}});
  td.when(mockAdapter.isInputDialog(td.matchers.isA(Object))).thenReturn(true);
  foundation.open();

  td.verify(mockAdapter.trapFocusOnSurface());
});

test('#close deactivates focus trapping on the input dialog surface', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();

  td.verify(mockAdapter.untrapFocusOnSurface());
});

test('#accept closes the input dialog', () => {
  const {foundation} = setupTest();

  foundation.accept();
  assert.isFalse(foundation.isOpen());
});

test('#accept calls accept when shouldNotify is set to true', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.accept(true);
  td.verify(mockAdapter.notifyAccept());
});

test('#cancel closes the input dialog', () => {
  const {foundation} = setupTest();

  foundation.cancel();
  assert.isFalse(foundation.isOpen());
});

test('#cancel calls notifyCancel when shouldNotify is set to true', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.cancel(true);
  td.verify(mockAdapter.notifyCancel());
});

test('on input dialog surface click closes and notifies acceptance if event target is the accept button', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerSurfaceInteractionHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.ACCEPT_BTN)).thenReturn(true);
  foundation.open();
  handlers.click(evt);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyAccept());
});

test('on input dialog surface click closes and notifies cancellation if event target is the cancel button', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerSurfaceInteractionHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.CANCEL_BTN)).thenReturn(true);
  foundation.open();
  handlers.click(evt);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyCancel());
});

test('on input dialog surface click does not close or notify if the event target is not the ' +
     'accept or cancel button', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerSurfaceInteractionHandler');
  const evt = {
    target: {},
    stopPropagation: () => {},
  };

  td.when(mockAdapter.eventTargetHasClass(evt.target, td.matchers.isA(String))).thenReturn(false);
  foundation.open();
  handlers.click(evt);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
  td.verify(mockAdapter.notifyCancel(), {times: 0});
  td.verify(mockAdapter.notifyAccept(), {times: 0});
});

test('on click closes the input dialog and notifies cancellation if event target is the backdrop', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.BACKDROP)).thenReturn(true);

  foundation.open();
  handlers.click(evt);

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyCancel());
});

test('on click does not close or notify cancellation if event target is the surface', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.BACKDROP)).thenReturn(false);

  foundation.open();
  handlers.click(evt);

  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
});

test('on document keydown closes the input dialog when escape key is pressed', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    key: 'Escape',
  });
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

test('on document keydown closes the input dialog when escape key is pressed using keycode', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    keyCode: 27,
  });
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

test('on document keydown calls notifyCancel', () => {
  const {foundation, mockAdapter} = setupTest();

  let keydown;
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    key: 'Escape',
  });

  td.verify(mockAdapter.notifyCancel());
});

test('on document keydown does nothing when key other than escape is pressed', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    key: 'Enter',
  });
  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
});

test('should clean up transition handlers after input dialog close', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isInputDialog(td.matchers.isA(Object))).thenReturn(true);
  td.when(mockAdapter.registerTransitionEndHandler(td.callback)).thenCallback({target: {}});
  foundation.close();
  td.verify(mockAdapter.deregisterTransitionEndHandler(td.matchers.isA(Function)));
});
