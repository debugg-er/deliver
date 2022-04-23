import { useEffect, EffectCallback, DependencyList, useRef } from "react";

export default function useDelayEffect(
  callback: EffectCallback,
  deps: DependencyList,
  timeout: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupRef = useRef<void | (() => void) | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      cleanupRef.current = callback();
      timeoutRef.current = null;
    }, timeout);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      } else if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, deps);
}
