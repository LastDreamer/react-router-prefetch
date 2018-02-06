import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';

import store from './store';

const App = ({ children }) => (
  <Provider store={store}>
    <Fragment>
      <LoadingBar />
      {children}
    </Fragment>
  </Provider>
);

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
