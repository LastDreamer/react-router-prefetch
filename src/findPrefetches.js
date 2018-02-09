import { Children } from 'react';

const getNodeType = (node) => {
  if (typeof node.type === 'function') {
    if (node.type.prototype.isReactComponent ||
        node.type.prototype.isPureReactComponent) {
      return 'statefull';
    }
    return 'stateless';
  }

  if (!node.type && node) {
    return node.constructor.name.toLocaleLowerCase();
  }

  return node.type.constructor.name.toLocaleLowerCase();
};

const initComponent = (node, context) => {
  switch (getNodeType(node)) {
    case 'statefull': {
      // eslint-disable-next-line new-cap
      const element = new node.type(node.props, context);

      if (element.componentWillMount) {
        try {
          element.componentWillMount();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('error');
        }
      }

      let component;

      try {
        component = element.render();
      } catch (e) {
        component = [];
      }

      return [
        component,
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

const findPrefetches = (node, context = {}, prefetchMethod = 'prefetch') => {
  let prefetches = [];

  if (!node) {
    return prefetches;
  }

  if (node.type &&
      node.type[prefetchMethod] &&
      !node.type.WrappedComponent &&
      !node.type.Naked
  ) {
    prefetches.push([node.type[prefetchMethod], node.props]);
  }

  const [component, childContext] = initComponent(node, context);

  if (component) {
    const nodeType = getNodeType(component);

    if (nodeType === 'stateless' || nodeType === 'statefull') {
      prefetches = prefetches.concat(
        findPrefetches(component, context, prefetchMethod),
      );
    } else {
      let children;

      if (nodeType === 'array') {
        children = component;
      } else if (component.props && component.props.children) {
        // eslint-disable-next-line prefer-destructuring
        children = component.props.children;
      }

      if (children) {
        Children.forEach(children, (child) => {
          const childPrefetches = findPrefetches(
            child,
            childContext,
            prefetchMethod,
          );

          if (childPrefetches.length) {
            prefetches = prefetches.concat(childPrefetches);
          }
        });
      }
    }
  }

  return prefetches;
};

export default findPrefetches;
