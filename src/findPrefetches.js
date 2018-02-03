import { Children } from 'react';

const getNodeType = (node) => {
  if (typeof node.type === 'function') {
    if (node.type.prototype.isReactComponent ||
        node.type.prototype.isPureReactComponent) {
      return 'statefull';
    }
    return 'stateless';
  }

  if (!node.type) {
    return 'string';
  }

  return node.type.constructor.name.toLocaleLowerCase();
};

const initComponent = (node, context) => {
  switch (getNodeType(node)) {
    case 'statefull': {
      // eslint-disable-next-line new-cap
      const element = new node.type(node.props, context);

      return [
        element.render(),
        Object.assign(
          context,
          element.getChildContext
            ? element.getChildContext()
            : {}),
      ];
    }
    case 'stateless':
      return [
        node.type(node.props, context),
        context,
      ];
    default:
      return [
        node,
        context,
      ];
  }
};

const findPrefecthes = (node, context = {}, prefetchMethod = 'prefetch') => {
  let prefetches = [];

  if (!node) {
    return prefetches;
  }

  if (node.type && node.type[prefetchMethod]) {
    prefetches.push([node.type[prefetchMethod], node.props]);
  }

  const [component, childContext] = initComponent(node, context);

  if (component) {
    const nodeType = getNodeType(component);

    if (nodeType === 'symbol') {
      Children.forEach(component.props.children, (child) => {
        const childPrefetches = findPrefecthes(
          child,
          childContext,
          prefetchMethod,
        );

        if (childPrefetches.length) {
          prefetches = prefetches.concat(childPrefetches);
        }
      });
    } else if (nodeType !== 'string') {
      prefetches = prefetches.concat(
        findPrefecthes(component, context, prefetchMethod),
      );
    }
  }

  return prefetches;
};

export default findPrefecthes;
