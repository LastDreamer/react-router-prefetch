/* global document */
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { MemoryRouter, Router } from 'react-router';
import ShallowRenderer from 'react-test-renderer/shallow';
import { mount, shallow } from 'enzyme';
import { createMemoryHistory } from 'history';

import Pages from '../stories/components/Pages';
import findPrefetches from '../src/findPrefetches';
import createSagaPrefetch from '../src/createSagaPrefetch';
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

  it('should call onFetchStart callback', () => {
    const node = document.createElement('div');
    const spy = jest.fn();
    ReactDom.render(
      <MemoryRouter
        initialEntries={['/one']}
      >
        <Prefetch
          onError={() => {}}
          onFetchStart={spy}
        >
          <Pages />
        </Prefetch>
      </MemoryRouter>,
      node,
    );

    expect(spy).toHaveBeenCalled();
  });

  it('should call onFetchEnd callback', () => {
    const node = document.createElement('div');
    const spy = jest.fn();
    ReactDom.render(
      <MemoryRouter
        initialEntries={['/three']}
      >
        <Prefetch
          onError={() => {}}
          onFetchEnd={spy}
        >
          <Pages />
        </Prefetch>
      </MemoryRouter>,
      node,
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        resolve();
      }, 1001);
    });
  });

  it('should call onError callback', () => {
    const node = document.createElement('div');
    const spy = jest.fn();

    ReactDom.render(
      <MemoryRouter
        initialEntries={['/four']}
      >
        <Prefetch
          onError={spy}
        >
          <Pages />
        </Prefetch>
      </MemoryRouter>,
      node,
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        resolve();
      }, 1501);
    });
  });

  it('should not call callbacks of got same path', () => {
    const node = document.createElement('div');
    const onStart = jest.fn();
    const onEnd = jest.fn();
    const history = createMemoryHistory();

    ReactDom.render(
      <Router
        initialEntries={['/three']}
        history={history}
      >
        <Prefetch
          onError={() => {}}
          onFetchStart={onStart}
          onFetchEnd={onEnd}
        >
          <Pages />
        </Prefetch>
      </Router>,
      node,
    );

    history.push({ pathname: '/three' });

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(onStart).toHaveBeenCalledTimes(1);
        expect(onEnd).toHaveBeenCalledTimes(1);
        resolve();
      }, 2001);
    });
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

describe('createSagaPrefetch', () => {
  it('should return Promise', () => {
    const prefetch = createSagaPrefetch(
      {
        dispatch: () => {},
      },
      'type',
      () => {},
      () => {},
    );

    expect(prefetch.constructor.name).toBe('Promise');
  });
});
