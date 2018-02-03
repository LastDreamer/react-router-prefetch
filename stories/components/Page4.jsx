import React, { Component } from 'react';

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

  render() {
    return (
      <h2>Component with error (never be showed)</h2>
    );
  }
}

export default Page4;
