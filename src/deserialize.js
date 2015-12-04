import React from 'react';

import getComponentName from './utils/getComponentName';

export default function deserialize(spec) {
  return Component => {
    const componentName = getComponentName(Component);

    return class DeserializeContainer extends React.Component {
      static displayName = `deserialize(${componentName})`;

      constructor(props, context) {
        super(props, context);

        this.deserializers = {};
        Object.keys(spec).forEach(propName => {
          let deserializer = spec[propName];
          if (deserializer.createDeserializer) {
            deserializer = deserializer.createDeserializer();
          }

          this.deserializers[propName] = deserializer;
        });
      }

      render() {
        const { props, context } = this;

        const deserializedProps = {};
        Object.keys(spec).forEach(propName => {
          deserializedProps[propName] =
            this.deserializers[propName](props, context);
        });

        return (
          <Component {...props} {...deserializedProps} />
        );
      }
    };
  };
}
