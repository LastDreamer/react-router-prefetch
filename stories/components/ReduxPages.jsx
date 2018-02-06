import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

import Page1Connected from './Page1Connected';
import Page2 from './Page2';
import { Page3Connected } from './Page3';
import { Page4Connected } from './Page4';

export default () => (
  <Fragment>
    <Route path="/one" component={Page1Connected} />
    <Route path="/two" component={Page2} />
    <Route path="/three" component={Page3Connected} />
    <Route path="/four" component={Page4Connected} />
  </Fragment>
);
