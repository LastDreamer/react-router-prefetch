/* global window */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo, setDefaults } from '@storybook/addon-info';

import App from './App';
import Router from './components/Router';
import Pages from './components/Pages';
import ReduxPages from './components/ReduxPages';
import Prefetch, { PrefetchComponent } from '../src';

setDefaults({
  text: 'Use it without withRouter, just <Prefetch> - it is '
    + '[storybook bug](https://github.com/storybooks/storybook/issues/2893)',
  propTables: [PrefetchComponent],
  propTablesExclude: [Router, Pages, Prefetch],
});

storiesOf('Common Usage', module)
  .add('without additional params', withInfo()(() => (
    <Router
      initialEntries={['/one']}
      initialIndex={0}
    >
      <Prefetch
        onError={message => window.alert(message)}
      >
        <Pages />
      </Prefetch>
    </Router>
  )))
  .add('with custom preloader', withInfo()(() => (
    <Router
      initialEntries={['/one']}
      initialIndex={0}
    >
      <Prefetch
        preloader={(
          // eslint-disable-next-line
          <marquee
            behavior="scroll"
            direction="left"
            style={{ width: 200 }}
          >
            Loading ...
          </marquee>
        )}
        onError={message => window.alert(message)}
      >
        <Pages />
      </Prefetch>
    </Router>
  )))
  .add('with loading hooks', withInfo()(() => (
    <Router
      initialEntries={['/one']}
      initialIndex={0}
    >
      <Prefetch
        onFetchStart={action('preloading began')}
        onFetchEnd={action('preloading over')}
        onError={message => window.alert(message)}
      >
        <Pages />
      </Prefetch>
    </Router>
  )))
  .add('with custom prefetch method', withInfo()(() => (
    <Router
      initialEntries={['/one']}
      initialIndex={0}
    >
      <p>Will fire only on error page</p>
      <Prefetch
        prefetchMethod="customPrefetch"
        onError={message => window.alert(message)}
      >
        <Pages />
      </Prefetch>
    </Router>
  )))
  .add('with custom error message', withInfo()(() => (
    <Router
      initialEntries={['/one']}
      initialIndex={0}
    >
      <p>Will fire only on error page</p>
      <Prefetch
        errorMessage="New error message"
        onError={message => window.alert(message)}
      >
        <Pages />
      </Prefetch>
    </Router>
  )));

storiesOf('Usage With Redux', module)
  .add('react-redux-loading-bar', withInfo()(() => (
    <Router
      initialEntries={['/one']}
      initialIndex={0}
    >
      <Prefetch
        prefetchMethod="loadingBarPrefetch"
        errorMessage="New error message"
        onError={message => window.alert(message)}
      >
        <App>
          <ReduxPages />
        </App>
      </Prefetch>
    </Router>
  )))
  .add('handlers in redux-saga', withInfo()(() => (
    <Router
      initialEntries={['/one']}
      initialIndex={0}
    >
      <Prefetch
        prefetchMethod="sagaPrefetch"
        errorMessage="New error message"
        onError={message => window.alert(message)}
      >
        <App>
          <ReduxPages />
        </App>
      </Prefetch>
    </Router>
  )));
