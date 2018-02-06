import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

import { createSagaPrefetch } from '../../src';
import types from '../types';
import { Page3Connected } from './Page3';

class Page1Connected extends Component {
  static loadingBarPrefetch(props) {
    return new Promise((resolve) => {
      props.dispatch(showLoading());

      setTimeout(() => {
        props.dispatch(hideLoading());

        resolve(props);
      }, 2000);
    });
  }

  static sagaPrefetch = props => createSagaPrefetch(
    props,
    types.DATA_REQUEST,
    'page1',
  )

  render() {
    return (
      <Fragment>
        <h1>Component with delay 2s</h1>
        <Page3Connected />
      </Fragment>
    );
  }
}

export default connect()(Page1Connected);
