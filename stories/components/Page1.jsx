import React, { Component, Fragment } from 'react';

import Page3 from './Page3';

class Page1 extends Component {
  static prefetch(props) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(props);
      }, 2000);
    });
  }

  render() {
    return (
      <Fragment>
        <h1>Component with delay 2s</h1>
        <Page3 />
      </Fragment>
    );
  }
}

export default Page1;
