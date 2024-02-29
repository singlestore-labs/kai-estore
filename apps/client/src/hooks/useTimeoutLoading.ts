import { useCallback, useEffect, useRef, useState } from "react";

export type UseTimeoutLoadingProps = { initialIsLoading?: boolean; delay?: number };

export function useTimeoutLoading({ initialIsLoading = false, delay = 0 }: UseTimeoutLoadingProps = {}) {
  const [isLoading, setIsLoading] = useState(initialIsLoading);
  const prevLoadingTimeout = useRef<NodeJS.Timeout>();

  const startLoading = useCallback(() => {
    prevLoadingTimeout.current = setTimeout(() => setIsLoading(true), delay);
  }, [delay]);

  const stopLoading = useCallback(() => {
    clearTimeout(prevLoadingTimeout.current);
    prevLoadingTimeout.current = undefined;
    setIsLoading(false);
  }, []);

  const setLoading = useCallback(
    (isLoading?: boolean) => {
      isLoading ? startLoading() : stopLoading();
    },
    [startLoading, stopLoading]
  );

  useEffect(() => {
    return () => clearTimeout(prevLoadingTimeout.current);
  }, [stopLoading]);

  return { isLoading, setLoading, startLoading, stopLoading };
}
