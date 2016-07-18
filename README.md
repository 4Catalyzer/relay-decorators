# relay-decorators [![npm][npm-badge]][npm]
Utility decorators for [Relay](http://facebook.github.io/relay/) components.

[![Discord][discord-badge]][discord]

## Guide

### Installation

```shell
$ npm install relay-decorators
```

### [`@poll(interval)`](/src/poll.js)

The `@poll` decorator sets up a wrapper component that uses `setInterval` to repeatedly call `props.relay.forceFetch` at a fixed interval (specified in milliseconds). This is not an ideal way to get updating data from a GraphQL server, but is convenient if you don't have proper subscriptions.

```js
import React from 'react';
import Relay from 'react-relay';
import poll from 'relay-decorators/lib/poll';

// type Widget {
//   size: Int
// }

@poll(1000) // Poll every second.
class WidgetSize extends React.Component {
  static propTypes = {
    widget: React.PropTypes.object.isRequired,
  };

  render() {
    return (
      <div>The current widget size is: {this.props.widget.size}.</div>
    );
  }
}

export default Relay.createContainer(WidgetSize, {
  fragments: {
    widget: () => Relay.QL`
      fragment on Widget {
        size
      }
    `,
  },
});
```

If a polling component has a parent with the same poll interval, the `@poll` decorator will coalesce the poll timeouts to enable the queries to be batched.

[npm-badge]: https://img.shields.io/npm/v/relay-decorators.svg
[npm]: https://www.npmjs.org/package/relay-decorators

[discord-badge]: https://img.shields.io/badge/Discord-join%20chat%20%E2%86%92-738bd7.svg
[discord]: https://discord.gg/0ZcbPKXt5bX40xsQ
