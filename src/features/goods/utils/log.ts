import { env } from '@config';

export const log = (...args) => {
  if (env.isProduction) {
    return;
  }
  try {
    if (typeof window.console !== 'undefined' && window.console && window.console.log) {
      const logArgs = Array.prototype.slice.apply(args);
      /* eslint-disable no-console */
      if (console.log.apply) {
        console.log.apply(console, logArgs);
      } else {
        console.log(logArgs);
      }
      /* eslint-enable no-console */
    }
  } catch (e) {}
};
