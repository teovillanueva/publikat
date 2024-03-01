import * as React from "react";

/**
 * Returns a memoized function that will only call the passed function when it hasn't been called for the wait period
 * @param func The function to be called
 * @param wait Wait period after function hasn't been called for
 * @returns A memoized function that is debounced
 */
export function useDebouncedCallback(func: Function, wait: number) {
  // Use a ref to store the timeout between renders
  // and prevent changes to it from causing re-renders
  const timeout = React.useRef<NodeJS.Timeout>();

  return React.useCallback(
    (...args: unknown[]) => {
      const later = () => {
        clearTimeout(timeout.current);
        func(...args);
      };

      clearTimeout(timeout.current);
      timeout.current = setTimeout(later, wait);
    },
    [func, wait]
  );
}
