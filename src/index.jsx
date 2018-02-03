/* global window */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter, StaticRouter } from 'react-router-dom';
import defaultsDeep from 'lodash/defaultsDeep';

import findPrefetches from './findPrefetches';

class Prefetch extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const prefetches = this.checkPrefetches(props);

    this.state = {
      initialHide: props.initialHide,
      prefetches,
      fetchRequested: !!prefetches.length,
      location: props.location,
      nextLocation: props.location,
    };
  }

  getChildContext = () => defaultsDeep({
    router: {
      route: {
        location: this.state.location,
      },
    },
  }, this.context)

  componentWillMount = this.prefetchRoutes

  componentWillReceiveProps(nextProps) {
    const { createHref } = this.context.router.history;
    if (createHref(nextProps.location) === createHref(this.state.location)) {
      return;
    }

    const prefetches = this.checkPrefetches(nextProps);

    if (prefetches.length) {
      this.setState({
        prefetches,
        fetchRequested: true,
        nextLocation: nextProps.location,
      }, this.prefetchRoutes);
    } else {
      this.setState({
        initialHide: false,
        location: nextProps.location,
      });
    }
  }

  checkPrefetches({ children, location, prefetchMethod }) {
    const context = this.context ? this.getChildContext() : {};

    return findPrefetches(
      <StaticRouter
        location={location}
        context={context}
      >
        {children}
      </StaticRouter>,
      {},
      prefetchMethod,
    );
  }

  prefetchRoutes() {
    if (this.state.fetchRequested) {
      const {
        onFetchStart,
        onFetchEnd,
        errorMessage,
        onError,
      } = this.props;

      onFetchStart();

      Promise
        .all(this.state.prefetches.map(
          ([getPromise, props]) => getPromise(props),
        ))
        .then(() => {
          this.setState({
            initialHide: false,
            prefetches: [],
            fetchRequested: false,
            location: this.state.nextLocation,
          }, () => {
            onFetchEnd();
          });
        })
        .catch((error) => {
          this.setState({
            fetchRequested: false,
            prefetches: [],
            nextLocation: this.state.location,
          }, () => {
            onError(errorMessage, error);
            onFetchEnd();
          });
        });
    } else if (this.state.initialHide) {
      this.setState({
        initialHide: false,
      });
    }
  }

  render() {
    const { children, preloader } = this.props;
    const { fetchRequested, initialHide } = this.state;

    return (
      <Fragment>
        { fetchRequested && preloader }
        { !(fetchRequested && initialHide) && children }
      </Fragment>
    );
  }
}

Prefetch.propTypes = {
  children: PropTypes.node.isRequired,
  errorMessage: PropTypes.string,
  initialHide: PropTypes.bool,
  onError: PropTypes.func,
  onFetchStart: PropTypes.func,
  onFetchEnd: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types
  prefetchMethod: PropTypes.string,
  preloader: PropTypes.node,
  location: PropTypes.shape().isRequired,
};

Prefetch.defaultProps = {
  errorMessage: 'Error while page loading',
  initialHide: true,
  onError: message => window.alert(message),
  onFetchStart: () => {},
  onFetchEnd: () => {},
  prefetchMethod: 'prefetch',
  preloader: 'Loading...',
};

export const PrefetchComponent = Prefetch;

export default withRouter(Prefetch);
