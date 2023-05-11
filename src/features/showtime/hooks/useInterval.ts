/**
 * 참조: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number | null) => {
  const timer = useRef(null);
  const savedCallback = useRef(callback);

  const clearTimer = () => {
    timer.current && clearInterval(timer.current);
  };

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    timer.current = setInterval(() => savedCallback.current(), delay);

    return clearTimer;
  }, [delay]);

  return {
    clearTimer,
  };
};
