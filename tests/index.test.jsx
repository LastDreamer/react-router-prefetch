import React, { Component } from 'react';
import { MemoryRouter } from 'react-router';
import ShallowRenderer from 'react-test-renderer/shallow';
import { mount, shallow } from 'enzyme';

import Pages from '../stories/components/Pages';
import findPrefetches from '../src/findPrefetches';
import Prefetch from '../src';

describe('Prefetch', () => {
  it('should render itself', () => {
    const wrapper = shallow(
      <Prefetch
        onError={() => {}}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should show children if prefetch not needed', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={['/two']}
      >
        <Prefetch
          onError={() => {}}
        >
          <Pages />
        </Prefetch>
      </MemoryRouter>,
    );

    expect(wrapper.find('h1').length).toBe(1);
  });

  it('should not show children if prefetch needed', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={['/one']}
      >
        <Prefetch
          onError={() => {}}
        >
          <Pages />
        </Prefetch>
      </MemoryRouter>,
    );

    expect(wrapper.find('h1').length).toBe(0);
  });

  it('should show children if prefetch needed and initialHide are false', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={['/one']}
      >
        <Prefetch
          onError={() => {}}
          initialHide={false}
        >
          <Pages />
        </Prefetch>
      </MemoryRouter>,
    );

    expect(wrapper.find('h1').length).toBe(1);
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

  it('should get methods with custom names', () => {
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

  it('should not app when componentWillMount returns error', () => {
    class ErrorComponent extends Component {
      componentWillMount() {
        throw new Error('hello');
      }

      render() {
        return (
          <div />
        );
      }
    }
    const renderer = new ShallowRenderer();
    renderer.render(
      <MemoryRouter
        initialEntries={['/four']}
      >
        <Pages />
        <ErrorComponent />
      </MemoryRouter>,
    );

    expect(() => {
      findPrefetches(renderer.getRenderOutput());
    }).not.toThrow();
  });
});
