import React from 'react';
import { MemoryRouter } from 'react-router';
import ShallowRenderer from 'react-test-renderer/shallow';

import Pages from '../stories/components/Pages';
import findPrefetches from '../src/findPrefetches';


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
