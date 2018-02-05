/* global window */
import React, { Component } from 'react';
import { MemoryRouter } from 'react-router';
import { Route } from 'react-router-dom';
import ShallowRenderer from 'react-test-renderer/shallow';
import { mount, shallow } from 'enzyme';

import Pages from '../stories/components/Pages';
import findPrefetches from '../src/findPrefetches';
import Prefetch from '../src';

class Test extends Component {
  static prefetch = () => new Promise((resolve) => resolve())

  render = () => <h1>Test</h1>
}

describe('Prefetch', () => {
  it('should render itself', () => {
    const wrapper = shallow(
      <Prefetch />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should not show children if prefetch needed', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={['/one']}
      >
        <Prefetch>
          <Pages />
        </Prefetch>
      </MemoryRouter>,
    );

    expect(wrapper.find('h1').length).toBe(0);
  });
});


describe('findPrefetches', () => {
  it('should get prefetches if exists', () => {
    const renderer = new ShallowRenderer();
    renderer.render(
      <MemoryRouter
        initialEntries={['/three']}
      >
        <Pages />
      </MemoryRouter>,
    );
    expect(findPrefetches(renderer.getRenderOutput()).length).toBe(1);
  });

  it('should not get prefetches if not exists', () => {
    const renderer = new ShallowRenderer();
    renderer.render(
      <MemoryRouter
        initialEntries={['/two']}
      >
        <Pages />
      </MemoryRouter>,
    );
    expect(findPrefetches(renderer.getRenderOutput()).length).toBe(0);
  });

  it('should get prefetches recursive', () => {
    const renderer = new ShallowRenderer();
    renderer.render(
      <MemoryRouter
        initialEntries={['/one']}
      >
        <Pages />
      </MemoryRouter>,
    );
    expect(findPrefetches(renderer.getRenderOutput()).length).toBe(2);
  });

  describe('should get methods with custom names', () => {
    const renderer = new ShallowRenderer();
    renderer.render(
      <MemoryRouter
        initialEntries={['/four']}
      >
        <Pages />
      </MemoryRouter>,
    );

    expect(findPrefetches(
      renderer.getRenderOutput(),
      {},
      'customPrefetch',
    ).length).toBe(1);
  });

  it('should not crash the app if nothing was passed', () => {
    expect(findPrefetches().length).toBe(0);
  });
});
