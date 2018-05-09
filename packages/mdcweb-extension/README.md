# Extension with additional Material Components for the Web (MDCWeb-Ext)

This package contains the master library for Material Components Web Extension. It simply wraps all of its
sibling packages up into one comprehensive library for convenience.

## Installation

```
npm install --save mdcweb-extension
```

## Usage

### Including the Sass

```scss
@import "mdcweb-extension/mdcweb-extension";
```

### Including the Javascript

```js
import * as mdcext from 'mdcweb-extension';
const multiselect = new mdcext.multiselect.MDCExtMultiselect(document.querySelector('.mdc-ext-multiselect'));
// OR
import { multiselect } from 'mdcweb-extension';
const multiselectControl = new multiselect.MDCExtMultiselect(document.querySelector('.mdc-ext-multiselect'));
```

### Auto-initialization of components

The `material-components-web` package automatically registers all MDC-Web components with
[mdc-auto-init](https://github.com/material-components/material-components-web/tree/master/packages/mdc-auto-init),
making it dead simple to create and initialize components
with zero configuration or manual work.

For example, say you want to use an [input dialog](../mdc-ext-input-dialog). Simply render the necessary
DOM, an attach the `data-mdc-auto-init="MDCExtInputDialog"` attribute.

```html
<aside id="js-input-dialog" class="mdc-ext-input-dialog" data-mdc-auto-init="MDCExtInputDialog">
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
```

Then at the bottom of your html, insert this script tag:

```html
<script>
  mdc.autoInit.register('MDCExtDatePicker', mdcext.datePicker.MDCExtDatePicker);
  mdc.autoInit()
</script>
```

This will automatically initialize the input dialog, as well as any other components marked with the
auto init data attribute. See [mdc-auto-init](https://github.com/material-components/material-components-web/tree/master/packages/mdc-auto-init)
for more info.
