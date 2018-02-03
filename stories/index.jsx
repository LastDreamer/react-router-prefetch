/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo, setDefaults } from '@storybook/addon-info';

import Router from './components/Router';
import Pages from './components/Pages';
import findPrefetches from '../src/findPrefetches';
import Prefetch, { PrefetchComponent } from '../src';

setDefaults({
  text: 'Use it without withRouter, just <Prefetch> - it is '
    +'[storybook bug](https://github.com/storybooks/storybook/issues/2893)',
  propTables: [ PrefetchComponent ],
  propTablesExclude: [Router, Pages, Prefetch],
});

storiesOf('Common Usage', module)
  .add('without additional params', withInfo()(() => (
      <Router
        initialEntries={['/one']}
        initialIndex={0}
      >
        <Prefetch>
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
          <marquee
            behavior="scroll"
            direction="left"
            style={{ width: 200 }}
          >
            Loading ...
          </marquee>
        )}
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
      >
        <Pages />
      </Prefetch>
    </Router>
  )))
  .add('with custon error handler', withInfo()(() => (
    <Router
      initialEntries={['/one']}
      initialIndex={0}
    >
      <p>Will fire only on error page</p>
      <Prefetch
        onError={action('New error handler')}
      >
        <Pages />
      </Prefetch>
    </Router>
  )));

storiesOf('Usage With Redux', module)
  .add('react-redux-loading-bar', () => (
    <h1>Exaples coming soon</h1>
  ))
  .add('handlers in redux-saga', () => (
    <h1>Exaples coming soon</h1>
  ));
