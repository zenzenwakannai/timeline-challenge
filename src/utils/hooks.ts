import { useCallback, useRef } from "react";

export const useThrottle = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
) => {
  const lastCallRef = useRef(0);

  const throttledCallback = useCallback(
    (...args: T) => {
      const now = Date.now();

      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, delay],
  );

  return throttledCallback;
};
