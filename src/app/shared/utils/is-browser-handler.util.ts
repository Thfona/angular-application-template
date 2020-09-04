export const isBrowserHandler = () => {
  const handle = <TFunction extends Function>(target: TFunction) => {
    for (const prop of Object.getOwnPropertyNames(target.prototype)) {
      const originalFunction: Function = target.prototype[prop];

      if (originalFunction instanceof Function) {
        target.prototype[prop] = function () {
          if (this.isBrowser) {
            return originalFunction.apply(this, arguments);
          }
        };
      }
    }
  };

  return handle;
};
