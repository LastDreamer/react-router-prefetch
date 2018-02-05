import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter, StaticRouter } from 'react-router-dom';
import defaultsDeep from 'lodash/defaultsDeep';

import findPrefetches from './findPrefetches';

class Prefetch extends Component {
  static contextTypes = {
    store: PropTypes.any,
    router: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    store: PropTypes.any,
    router: PropTypes.object.isRequired,
  }

  state = {
    initialHide: this.props.initialHide,
  }

  getChildContext = () => defaultsDeep({
    router: {
      route: {
        location: this.state.location,
      },
    },
  }, this.context)

  componentDidMount = () => this.checkPrefetches(this.props)

  componentWillReceiveProps = this.checkPrefetches

  transitionsCount = 0

  checkPrefetches({ children, location, prefetchMethod }) {
    const { createHref } = this.context.router.history;

    if (this.state.location &&
        createHref(location) === createHref(this.state.location)) {
      return;
    }

    this.transitionsCount += 1;

    const context = defaultsDeep({
      router: {
        location,
      },
    }, this.getChildContext());

    const prefetches = findPrefetches(
      <StaticRouter
        context={this.getChildContext()}
        location={location}
      >
        {React.cloneElement(children)}
      </StaticRouter>,
      context,
      prefetchMethod,
    );

    if (prefetches.length) {
      this.setState({
        prefetches,
        fetchRequested: true,
        nextLocation: location,
      }, this.prefetchRoutes);
    } else {
      this.setState({
        initialHide: false,
        fetchRequested: false,
        location,
      });
    }
  }

  prefetchRoutes() {
    const {
      onFetchStart,
      onFetchEnd,
      errorMessage,
      onError,
    } = this.props;

    onFetchStart();

    const currentTransition = this.transitionsCount;

    Promise
      .all(this.state.prefetches.map(
        ([getPromise, props]) => getPromise(props),
      ))
      .then(() => {
        if (currentTransition === this.transitionsCount) {
          this.setState({
            initialHide: false,
            prefetches: [],
            fetchRequested: false,
            location: this.state.nextLocation,
          }, () => {
            onFetchEnd();
          });
        }
      })
      .catch((error) => {
        if (currentTransition === this.transitionsCount) {
          this.setState({
            fetchRequested: false,
            prefetches: [],
            nextLocation: this.state.location,
          }, () => {
            onError(errorMessage, error);
            onFetchEnd();
          });
        }
      });
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
  onError: PropTypes.func.isRequired,
  onFetchStart: PropTypes.func,
  onFetchEnd: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types
  prefetchMethod: PropTypes.string,
  preloader: PropTypes.node,
};

Prefetch.defaultProps = {
  errorMessage: 'Error while page loading',
  initialHide: true,
  onFetchStart: () => {},
  onFetchEnd: () => {},
  prefetchMethod: 'prefetch',
  preloader: 'Loading...',
};

export const PrefetchComponent = Prefetch;

export default withRouter(Prefetch);
