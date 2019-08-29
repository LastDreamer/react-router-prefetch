import React from 'react';

const Page5 = () => (<h2>Functional component</h2>);

Page5.prefetch = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 1500);
});

export default Page5;
