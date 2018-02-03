import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';

export default () => (
  <Fragment>
    <Route path="/one" component={Page1} />
    <Route path="/two" component={Page2} />
    <Route path="/three" component={Page3} />
    <Route path="/four" component={Page4} />
  </Fragment>
);
