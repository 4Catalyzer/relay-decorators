import React from 'react';

import getComponentName from './utils/getComponentName';

const pollerShape = React.PropTypes.shape({
  subscribe: React.PropTypes.func.isRequired,
});

export default function poll(interval) {
  const contextName = `@@relayPoller/${interval}`;

  const propTypes = {
    relay: React.PropTypes.object.isRequired,
  };

  const contextTypes = {
    [contextName]: pollerShape,
  };

  const childContextTypes = {
    [contextName]: pollerShape.isRequired,
  };

  return Component => {
    const displayName = `poll(${getComponentName(Component)})`;

    class PollContainer extends React.Component {
      constructor(props, context) {
        super(props, context);

        if (context[contextName]) {
          this.unsubscribe = null;
        } else {
          this.pollHandle = null;
          this.listeners = [];
        }
      }

      getChildContext() {
        const parent = this.context[contextName];
        if (parent) {
          return {
            [contextName]: parent,
          };
        }

        return {
          [contextName]: this,
        };
      }

      componentDidMount() {
        const parent = this.context[contextName];

        // If there is a parent poller, let it handle the timeouts so we can
        // potentially batch requests.
        if (parent) {
          this.unsubscribe = parent.subscribe(onReadyStateChange => {
            this.props.relay.forceFetch(null, onReadyStateChange);
          });

          return;
        }

        this.schedulePoll();
      }

      componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe();
        }

        if (this.pollHandle) {
          clearTimeout(this.pollHandle);
          this.pollHandle = null;
        }
      }

      schedulePoll() {
        this.pollHandle = setTimeout(this.poll, interval);
      }

      poll = () => {
        const numToUpdate = this.listeners.length + 1;
        let numUpdated = 0;

        const onReadyStateChange = ({ done, error, aborted }) => {
          if (!(done || error || aborted)) {
            return;
          }

          // Stop polling if we're unmounted.
          if (!this.pollHandle) {
            return;
          }

          ++numUpdated;
          if (numUpdated !== numToUpdate) {
            return;
          }

          // Only schedule a new poll once everything has updated.
          this.schedulePoll();
        };

        this.props.relay.forceFetch(null, onReadyStateChange);
        this.listeners.forEach(listener => { listener(onReadyStateChange); });
      };

      subscribe = (listener) => {
        this.listeners.push(listener);

        return () => {
          this.listeners = this.listeners.filter(item => item !== listener);
        };
      };

      render() {
        return React.createElement(Component, this.props);
      }
    }

    PollContainer.displayName = displayName;
    PollContainer.propTypes = propTypes;
    PollContainer.contextTypes = contextTypes;
    PollContainer.childContextTypes = childContextTypes;

    return PollContainer;
  };
}
