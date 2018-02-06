import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

import { createSagaPrefetch } from '../../src';
import types from '../types';

class Page4 extends Component {
  static prefetch() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // eslint-disable-next-line
        reject({ message: 'Error while loading' });
      }, 1500);
    });
  }

  static customPrefetch() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // eslint-disable-next-line
        reject({ message: 'Error while loading' });
      }, 1500);
    });
  }

  static loadingBarPrefetch(props) {
    return new Promise((resolve, reject) => {
      props.dispatch(showLoading());

      setTimeout(() => {
        props.dispatch(hideLoading());

        reject(props);
      }, 1000);
    });
  }

  static sagaPrefetch = props => createSagaPrefetch(
    props,
    types.DATA_REQUEST,
    'error',
  )

  render() {
    return (
      <h2>Component with error (never be showed)</h2>
    );
  }
}

export const Page4Connected = connect()(Page4);

export default Page4;
