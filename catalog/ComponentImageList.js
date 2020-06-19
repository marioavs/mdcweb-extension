import React, {Component} from 'react';
import {MDCRipple} from '@material/ripple/index';
import {Link} from 'react-router-dom';

import buttonImg from './images/buttons_180px.svg';
import treeviewImg from './images/checkbox_180px.svg';

// ComponentImageList renders the home page with a link to each component.
class ComponentImageList extends Component {

  ripples = [];
  initRipple = el => el && this.ripples.push(new MDCRipple(el));

  componentWillUnmount() {
    this.ripples.forEach(ripple => ripple.destroy());
  }

  render() {
    return (
      <div>
        <ul id='catalog-image-list' className='mdc-image-list standard-image-list mdc-top-app-bar--fixed-adjust'>
          {this.renderListItem('Treeview', treeviewImg, 'treeview')}
          {this.renderListItem('Button', buttonImg, 'button')}
        </ul>
      </div>
    );
  }

  renderListItem(title, imageSource, url) {
    const fullUrl = `/component/${url}`;
    return (
      <li className='catalog-image-list-item mdc-image-list__item'>
        <Link to={fullUrl} className='catalog-image-link'>
          <div className='catalog-image-list-item-container mdc-image-list__image-aspect-container mdc-ripple-surface'
               ref={(el) => el && this.initRipple(el)}>
            <div className='mdc-image-list__image' dangerouslySetInnerHTML={{__html: imageSource}} />
          </div>

          <div className='mdc-image-list__supporting'>
            <span className='catalog-image-list-label mdc-image-list__label'>{title}</span>
          </div>
        </Link>
      </li>
    );
  }
}

export default ComponentImageList;
