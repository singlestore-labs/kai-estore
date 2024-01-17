import { useEffect, useMemo, useRef } from "react";
import debounce from "lodash.debounce";

import { AnyFunction } from "@/types/helpers";

export function useDebounce<T extends AnyFunction = AnyFunction>(callback: T, wait = 1000) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = <T extends any[]>(...args: T) => {
      ref.current?.(...args);
    };

    return debounce(func, wait);
  }, [wait]);

  return debouncedCallback;
}
