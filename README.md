# relay-decorators [![npm][npm-badge]][npm]
Utility decorators for [Relay](http://facebook.github.io/relay/) components.

[![Discord][discord-badge]][discord]

## Guide

### Installation

```shell
$ npm install relay-decorators
```

### [`@deserialize`](/src/deserialize.js)

In lieu of [facebook/relay#91](https://github.com/facebook/relay/issues/91),
the `@deserialize` decorator offers a convenient way to deserialize custom
scalar data from Relay. `@deserialize` adds a container component that
deserializes raw data from Relay and injects the deserialized values into the
decorated component as props.

`react-decorators` ships with [`jsonDeserializer`](/src/jsonDeserializer.js),
as an example deserializer. `jsonDeserializer` deserializes JSON data from
strings. It memoizes its return value, and preserves reference equality as long
as the input string does not change.

**Note: For actual JSON fields, use
[graphql-type-json](https://github.com/taion/graphql-type-json) instead of
`jsonDeserializer`.**

```js
import React from 'react';
import Relay from 'react-relay';

import deserialize from 'relay-decorators/lib/deserialize';
import jsonDeserializer from 'relay-decorators/lib/jsonDeserializer';

// type Widget {
//   blob: String
// }

@deserialize({
  blob: jsonDeserializer(({ widget }) => widget.blob),
})
class WidgetBlobKeys extends React.Component {
  static propTypes = {
    blob: React.PropTypes.object.isRequired,
  };

  render() {
    const blobKeys = Object.keys(this.props.blob).join(', ');

    return (
      <div>The blob keys are: {blobKeys}.</div>
    );
  }
}

export default Relay.createContainer(WidgetBlobKeys, {
  fragments: {
    widget: () => Relay.QL`
      fragment on Widget {
        blob,
      }
    `,
  },
});
```

### [`@poll(interval)`](/src/poll.js)

The `@poll` decorator sets up a wrapper component that uses `setInterval` to
repeatedly call `props.relay.forceFetch` at a fixed interval (specified in
milliseconds). This is not an ideal way to get updating data from a GraphQL
server, but is convenient if you don't have proper subscriptions.

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
        size,
      }
    `,
  },
});
```

[npm-badge]: https://img.shields.io/npm/v/relay-decorators.svg
[npm]: https://www.npmjs.org/package/relay-decorators

[discord-badge]: https://img.shields.io/badge/Discord-join%20chat%20%E2%86%92-738bd7.svg
[discord]: https://discord.gg/0ZcbPKXt5bX40xsQ
