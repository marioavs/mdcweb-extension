import React, { Component } from 'react';
import ComponentCatalogPanel from './ComponentCatalogPanel.js';
import classnames from 'classnames';
import { MDCExtTreeview } from '@mdcext/treeview';

import './styles/TreeviewCatalog.scss';

const TreeviewTypes = {
  basic: 'basic',
  disabled: 'disabled',
};

const TreeviewCatalog = (props) => {
  return (
    <ComponentCatalogPanel
      hero={<TreeviewHero />}
      title='Treeview'
      description='Treeview contain a tree of checkbox nodes.'
      designLink='https://material.io/components/selection-controls'
      docsLink='https://material.io/components/web/catalog/'
      sourceLink='https://github.com/marioavs/mdcweb-extension/tree/master/packages/mdc-ext-treeview'
      demos={<TreeviewDemos />}
      initialConfig={TreeviewConfig}
      {...props}
    />
  );
};

const classes = ({ className, type }) => {
  const { disabled } = TreeviewTypes;
  return classnames('mdc-ext-treeview', className, {
    'mdc-ext-treeview--disabled': type === disabled,
  });
};

class TreeviewHero extends Component {
  treeview;
  tvEl;
  initRef = (el) => {
    if (el) {
      this.tvEl = el;
      this.treeview = new MDCExtTreeview(el);
    }
  };

  componentDidUpdate() {
    if (this.treeview) {
      this.treeview.destroy();
      this.treeview = null;
    }
    if (this.tvEl) {
      this.treeview = new MDCExtTreeview(this.tvEl);
    }
  }

  render() {
    const idPrefix = 'tv-hero';
    return (
      <div className={classes(this.props)} ref={this.initRef}>
        <TreeviewNode>
          <TreeviewItem id={`${idPrefix}-100`} label='Asia' />
          <TreeviewItem id={`${idPrefix}-200`} label='America'>
            <TreeviewNode>
              <TreeviewItem id={`${idPrefix}-210`} label='North America'>
                <TreeviewNode>
                  <TreeviewItem id={`${idPrefix}-211`} label='Canada' />
                  <TreeviewItem id={`${idPrefix}-212`} label='Mexico' />
                  <TreeviewItem id={`${idPrefix}-213`} label='Canada' />
                </TreeviewNode>
              </TreeviewItem>
              <TreeviewItem id={`${idPrefix}-220`} label='Central America'>
                <TreeviewNode>
                  <TreeviewItem id={`${idPrefix}-221`} label='Belize' />
                  <TreeviewItem id={`${idPrefix}-222`} label='Costa Rica' />
                  <TreeviewItem id={`${idPrefix}-223`} label='El Salvador' />
                  <TreeviewItem id={`${idPrefix}-224`} label='Guatemala' />
                </TreeviewNode>
              </TreeviewItem>
            </TreeviewNode>
          </TreeviewItem>
        </TreeviewNode>
      </div>
    );
  }
}

export const Treeview = (props) => {
  const idPrefix = 'tv';
  return (
    <div className={classes(props)} ref={treeviewEl => {
      console.log("INSIDE arrow function ", treeviewEl);
      return (treeviewEl && new MDCExtTreeview(treeviewEl))
    }
    }>
      <TreeviewNode>
        <TreeviewItem id={`${idPrefix}-100`} label='Asia' />
        <TreeviewItem id={`${idPrefix}-200`} label='America'>
          <TreeviewNode>
            <TreeviewItem id={`${idPrefix}-210`} label='North America'>
              <TreeviewNode>
                <TreeviewItem id={`${idPrefix}-211`} label='Canada' />
                <TreeviewItem id={`${idPrefix}-212`} label='Mexico' />
                <TreeviewItem id={`${idPrefix}-213`} label='Canada' />
              </TreeviewNode>
            </TreeviewItem>
            <TreeviewItem id={`${idPrefix}-220`} label='Central America'>
              <TreeviewNode>
                <TreeviewItem id={`${idPrefix}-221`} label='Belize' />
                <TreeviewItem id={`${idPrefix}-222`} label='Costa Rica' />
                <TreeviewItem id={`${idPrefix}-223`} label='El Salvador' />
                <TreeviewItem id={`${idPrefix}-224`} label='Guatemala' />
              </TreeviewNode>
            </TreeviewItem>
          </TreeviewNode>
        </TreeviewItem>
      </TreeviewNode>
    </div>
  );
};

const TreeviewItem = (props) => (
  <li id={props.id} className="mdc-ext-treeview__item">
    <TreeviewRow {...props} />
    {props.children}
  </li>
);

const TreeviewNode = (props) => (
  <ul className="mdc-ext-treeview__node">
    {props.children}
  </ul>
);

const TreeviewRow = (props) => {
  let { id, label, children } = props;
  const classes = classnames('mdc-ext-treeview__row', {
    'mdc-ext-treeview__row--with-children': Boolean(children),
  });
  const toggleId = `toogle-${id}`;

  return (
    <React.Fragment>
      <input type="checkbox" id={toggleId} className="mdc-ext-treeview__toggle" />
      <div className={classes}>
        <label htmlFor={toggleId} className="mdc-ext-treeview__toggle-icon"></label>
        <div className="mdc-checkbox">
          <input type="checkbox" className="mdc-checkbox__native-control mdc-ext-treeview__checkbox-native-control" />
          <div className="mdc-checkbox__background">
            <svg className="mdc-checkbox__checkmark" viewBox="0 0 24 24">
              <path className="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
            </svg>
            <div className="mdc-checkbox__checkmark mdc-ext-treeview-checkbox__default-checkmark"></div>
            <div className="mdc-checkbox__mixedmark"></div>
          </div>
        </div>
        <label htmlFor={toggleId} className="mdc-ext-treeview__label">{label}</label>
      </div>
    </React.Fragment>
  );
};

const TreeviewDemos = () => {
  return (
    <div>
      <h3 className='mdc-typography--subtitle1'>Basic</h3>
      <div className='treeview-row'>
        <Treeview variantClass='' />
      </div>
    </div>
  );
};

export const TreeviewReactTemplate = (props) => {
  const type = props.options.type.value;
  const className = classes({ type });

  return `
  <Treeview className='${className}'>
    <TreeviewNode>
      <TreeviewItem id='node-100' label='Asia' />
      <TreeviewItem id='node-200' label='America'>
        <TreeviewNode>
          <TreeviewItem id='node-210' label='North America'>
            <TreeviewNode>
              <TreeviewItem id='node-211' label='Canada' />
              <TreeviewItem id='node-212' label='Mexico' />
              <TreeviewItem id='node-213' label='Canada' />
            </TreeviewNode>
          </TreeviewItem>
          <TreeviewItem id='node-220' label='Central America'>
            <TreeviewNode>
              <TreeviewItem id='node-221' label='Belize' />
              <TreeviewItem id='node-222' label='Costa Rica' />
              <TreeviewItem id='node-223' label='El Salvador' />
              <TreeviewItem id='node-224' label='Guatemala' />
            </TreeviewNode>
          </TreeviewItem>
        </TreeviewNode>
      </TreeviewItem>
    </TreeviewNode>
  </Treeview>
  `;
};

const TreeviewConfig = {
  options: {
    header: {
      type: 'label',
      name: 'Options',
    },
    type: {
      type: 'select',
      name: 'Variant',
      urlParam: 'type',
      value: 'basic', // default select first option
      options: [
        {
          label: 'Basic',
          value: TreeviewTypes.basic,
        },
        {
          label: 'Disabled',
          value: TreeviewTypes.disabled,
        },
      ],
    },
  },
  order: [
    'header', 'type',
  ],
};

export default TreeviewCatalog;
