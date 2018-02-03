import React, { Component } from 'react';

class Page3 extends Component {
  static prefetch() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });
  }

  render() {
    return (<h2>Component with delay 1s</h2>);
  }
}

export default Page3;
