import React from 'react';

import getComponentName from './utils/getComponentName';

export default function poll(interval) {
  return Component => {
    const componentName = getComponentName(Component);

    return class PollContainer extends React.Component {
      static displayName = `poll(${componentName})`;

      static propTypes = {
        relay: React.PropTypes.object.isRequired,
      };

      constructor(props, context) {
        super(props, context);

        this._pollHandle = null;
      }

      componentDidMount() {
        this.schedulePoll();
      }

      componentWillUnmount() {
        if (this._pollHandle !== null) {
          clearTimeout(this._pollHandle);
        }
      }

      schedulePoll() {
        this._pollHandle = setTimeout(() => {
          this.props.relay.forceFetch({}, ({ done, error, aborted }) => {
            if (done || error || aborted) {
              this.schedulePoll();
            }
          });
        }, interval);
      }

      render() {
        return <Component {...this.props} />;
      }
    };
  };
}
