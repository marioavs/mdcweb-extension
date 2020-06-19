<!--docs:
title: "Treeview"
layout: detail
section: components
excerpt: "MDC Web extension Treeview"
iconId: selection_control
path: /catalog/input-controls/treeview/
-->

# Treeview

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/<SCREENSHOT_NAME>.png"
    width="<SCREENSHOT_WIDTH>" alt="<COMPONENT_NAME> screenshot">
  </a>
</div>-->

MDC Web Extension Treeview provides a Material Design treeview with checkbox for each node.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-checkboxes">Material Design guidelines: Selection Controls – Checkbox</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/checkbox">Demo</a>
  </li>
</ul>

## Installation

```
npm install @mdcweb/treeview
```

## Basic Usage

The treeview uses a [`MDCCheckbox`](https://material-components.github.io/material-components-web-catalog/#/component/checkbox) component instance for each tree node

### HTML

```html
<div class="mdc-ext-treeview">
  <ul class="mdc-ext-treeview__node">
    <li class="mdc-ext-treeview__row">
      <input type="checkbox" id="toggle-100" class="mdc-ext-treeview__toggle"/>
      <label for="toggle-100" class="mdc-ext-treeview__toggle-icon"></label>
      <div class="mdc-checkbox">
        <input type="checkbox" class="mdc-checkbox__native-control" />
        <div class="mdc-checkbox__background">
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
        <div class="mdc-checkbox__ripple"></div>
      </div>
      <label for="toggle-100" class="mdc-ext-treeview__label">Asia</label>
    </li>
    <li class="mdc-ext-treeview__row">
      <input type="checkbox" id="toggle-200" class="mdc-ext-treeview__toggle" checked="checked"/>
      <label for="toggle-200" class="mdc-ext-treeview__toggle-icon"></label>
      <div class="mdc-checkbox">
        <input type="checkbox" class="mdc-checkbox__native-control" />
        <div class="mdc-checkbox__background">
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
        <div class="mdc-checkbox__ripple"></div>
      </div>
      <label for="toggle-200" class="mdc-ext-treeview__label">America</label>
      <ul class="mdc-ext-treeview__node">
        <li class="mdc-ext-treeview__row">
          <input type="checkbox" id="toggle-210" class="mdc-ext-treeview__toggle"/>
          <label for="toggle-210" class="mdc-ext-treeview__toggle-icon"></label>
          <div class="mdc-checkbox">
            <input type="checkbox" class="mdc-checkbox__native-control" />
            <div class="mdc-checkbox__background">
              <div class="mdc-checkbox__mixedmark"></div>
            </div>
            <div class="mdc-checkbox__ripple"></div>
          </div>
          <label for="toggle-210" class="mdc-ext-treeview__label">North America</label>
        </li>
        <li class="mdc-ext-treeview__row">
          <input type="checkbox" id="toggle-220" class="mdc-ext-treeview__toggle"/>
          <label for="toggle-220" class="mdc-ext-treeview__toggle-icon"></label>
          <div class="mdc-checkbox">
            <input type="checkbox" class="mdc-checkbox__native-control" />
            <div class="mdc-checkbox__background">
              <div class="mdc-checkbox__mixedmark"></div>
            </div>
            <div class="mdc-checkbox__ripple"></div>
          </div>
          <label for="toggle-220" class="mdc-ext-treeview__label">Central America</label>
        </li>
      </ul>
    </li>
  </ul>
</div>
```

### Styles

When using the treeview, you will also need to load the MDC Checbox component styles.

```scss
@use "@material/checkbox/mdc-checkbox";
@use "@mdcext/treeview/mdc-ext-treeview";
```

### JavaScript Instantiation

```js
import {MDCExtTreeview} from '@mdcext/treeview';

const treeview = new MDCExtTreeview(document.querySelector('.mdc-ext-treeview'));

treeview.listen('MDCExtTreeview:toggle', () => {
  alert(`Treeview node changed`);
});
```

> See [Importing the JS component](https://github.com/material-components/material-components-web/blob/master/docs/importing-js.md) for more information on how to import JavaScript.


## Style Customization

#### CSS Classes

| Class | Description |
| --- | --- |
| `mdc-treeview` | Mandatory. |
| `mdc-treeview__node` | Mandatory. This element should be placed within the `mdc-treeview` element. |

## `Treeview` Properties and Methods

Property Name | Type | Description
--- | --- | ---
`treeStateArray` | `Array` | Getter for the treeview's nodes checked state


## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Treeview for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](https://github.com/material-components/material-components-web/blob/master/docs/integrating-into-frameworks.md).
