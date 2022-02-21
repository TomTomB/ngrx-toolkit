export const getSideChannel = () => {
  const map = new WeakMap();

  const channel = {
    get: (key: Record<string, unknown> | Function) => {
      return map.get(key);
    },
    set: (key: Record<string, unknown> | Function, value: unknown) => {
      map.set(key, value);
    },
    has: (key: Record<string, unknown> | Function) => {
      return map.has(key);
    },
  };

  return channel;
};
