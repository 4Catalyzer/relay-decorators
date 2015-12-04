export default function jsonDeserializer(getRawValue) {
  return {
    createDeserializer() {
      let lastRawValue;
      let lastParsedValue;

      return (props, context) => {
        const rawValue = getRawValue(props, context);
        if (rawValue == null) {
          return rawValue;
        }

        if (rawValue !== lastRawValue) {
          lastRawValue = rawValue;
          lastParsedValue = JSON.parse(rawValue);
        }

        return lastParsedValue;
      };
    },
  };
}
