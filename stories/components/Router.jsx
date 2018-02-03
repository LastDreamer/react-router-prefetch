import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router';

import Links from './Links';

const Router = ({ children, ...props }) => (
  <MemoryRouter {...props} >
    <Fragment>
      <Links />
      { children }
    </Fragment>
  </MemoryRouter>
);

Router.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Router;
