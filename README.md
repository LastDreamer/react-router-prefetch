# react-router-prefetch

[![Build Status](https://travis-ci.org/LastDreamer/react-router-prefetch.svg?branch=master)](https://travis-ci.org/LastDreamer/react-router-prefetch)
[![Coverage Status](https://coveralls.io/repos/github/LastDreamer/react-router-prefetch/badge.svg?branch=master)](https://coveralls.io/github/LastDreamer/react-router-prefetch?branch=master)

Load data for components before router transition. [Live Demo](https://lastdreamer.github.io/react-router-prefetch/index.html)

## Installation
```shell
npm i --save react-router-prefetch
```

## Usage

For prefetching enable need only 2 steps:

1. Add static method prefetch to your component that return Promise
1. Wrap Router childs into component Prefetch from this package

```jsx
// component.jsx
import React, ( Component ) from 'react';

class MyComponent extends Component {
  static prefetch(props) {
    return new Promise((resolve) => {
      fetch(`/data/${props.id}`)
        .then(data => resolve(data));
    });
  }
  
  render() {
    ...
  }
}

export default MyComponent;

// routes.jsx
import { BrowserRouter as Router } from 'react-router';
import Prefetch from 'react-router-prefetch';
import Routes from '...';

const App = (history) => (
  <Router history={history}>
    <Prefetch>
      <Routes />
    </Prefetch>
  </Router>
)

export default App;
```


## Properties

| Name           | Type     | Default                    | Description                                                     |
|----------------+----------+----------------------------+-----------------------------------------------------------------|
| initialHide    | `bool`   | true                       | Hide children on initial transition                             |
| errorMessage   | `string` | 'Error while page loading' | Message for Promise rejecting callback                          |
| prefetchMethod | `string` | 'prefetch'                 | Name of method that Prefetch will recursively search in chilren |
| preloader      | `node`   | 'Loading...'               | String or Component displays while fetching                     |
| onError        | `func`   |                            | Promise rejecting callback                                      |
| onFetchStart   | `func`   |                            | Callback before prefetch                                        |
| onFetchEnd     | `func`   |                            | Callback after prefetch or reject                               |
