import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

import { createSagaPrefetch } from '../../src';
import types from '../types';

let asyncData;

class Page3 extends Component {
  static prefetch() {
    return new Promise((resolve) => {
      setTimeout(() => {
        asyncData = 'Async data';
        resolve();
      }, 1000);
    });
  }

  static loadingBarPrefetch(props) {
    return new Promise((resolve) => {
      props.dispatch(showLoading());

      setTimeout(() => {
        props.dispatch(hideLoading());

        resolve(props);
      }, 1000);
    });
  }

  static sagaPrefetch = props => createSagaPrefetch(
    props,
    types.DATA_REQUEST,
    'page2',
  )

  render() {
    return (
      <Fragment>
        <h2>Component with delay 1s</h2>
        <p>{asyncData}</p>
      </Fragment>
    );
  }
}

export const Page3Connected = connect()(Page3);

export default Page3;
