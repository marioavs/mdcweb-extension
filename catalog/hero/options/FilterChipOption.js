import React, { Component, Children } from 'react';
import { MDCChipSet } from '@material/chips/chip-set/index';
import { updateUrl } from '../HeroOptionsComponent';
import { getUrlParamsFromSearch } from '../urlHelper';

export default class FilterChipOption extends Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = { selectedChipIds: value ? value : [] };
  }

  componentDidUpdate(prevProps) {
    const searchParams = getUrlParamsFromSearch(this.props.location.search);
    const icons = (searchParams.icons && searchParams.icons.split(',').filter((icon) => !!icon)) || [];
    if (icons.length !== this.state.selectedChipIds.length) {
      this.setState({ selectedChipIds: icons });
    }
  }

  updateSelectedChipIds = (selectedChipIds) => {
    const { history, urlParam, location } = this.props;
    updateUrl(history, urlParam, selectedChipIds.toString(), location.search);
  };

  render() {
    const {
      name,
      options,
      optionDescription,
    } = this.props;

    return (
      <React.Fragment>
        <li className='mdc-list-item'>
          <span className='mdc-typography--overline'>
            {name}
          </span>
        </li>
        <li className='mdc-list-item'>
          <span className='mdc-typography--caption'>
            {optionDescription}
            Follow the <a href='http://google.github.io/material-design-icons/'>instructions</a> to embed the icon font in your site.
          </span>
        </li>
        <li className='mdc-list-item'>
          <ChipSet
            filter
            className='hero-component__filter-chip-set-option'
            handleSelect={this.updateSelectedChipIds}
          >
            {options.map((opt) => (
              <Chip
                key={opt.value}
                id={opt.value}
                data-id={opt.value}
                label={opt.label}
                selected={this.state.selectedChipIds.includes(opt.value)}
              />
            ))}
          </ChipSet>
        </li>
      </React.Fragment>
    );
  }
}

// TODO: test ChipSet and Chip components (including selection event handling)
class ChipSet extends Component {
  constructor(props) {
    super(props);
    this.chipSet = null;
  }

  componentWillUnmount() {
    this.chipSet.destroy();
  }

  render() {
    const classes = classnames('mdc-chip-set', className, {
      'mdc-chip-set--filter': this.props.filter,
    });

    const initChipSet = chipSetEl => {
      if (chipSetEl) {
        this.chipSet = new MDCChipSet(chipSetEl);
      }
    }
    return (
      <div className='mdc-chip-set' role='grid' ref={initChipSet}>
        {this.props.children}
      </div>
    );
  }
}

const Chip = (props) => {
  let { className, id, selected, text } = props;
  const classes = classnames('mdc-chip', className, {
    'mdc-chip--selected': selected,
  });

  return (
    <div className={classes} id={id} role='row'>
      {selected ?
        <i className={`material-icons mdc-chip__icon mdc-chip__icon--leading ${classes}`}>
          {name}
        </i> : null}
      <span role='button' tabIndex='0' class='mdc-chip__text'>{text}</span>
    </div>
  );
};