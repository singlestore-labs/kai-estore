import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";

type ParamsArg<T extends Record<any, any> = Record<any, any>> = T | ((params: T) => T);

const paramsConnector = "?";

export function useSearchParams<T extends Record<any, any> = Record<any, any>>({
  path: initialPath
}: { path?: string } = {}) {
  const { push: navigate, replace, asPath, query } = useRouter() || { asPath: "", push: undefined };
  const [routerPath, paramsString] = asPath.split(paramsConnector);
  const path = initialPath ?? routerPath;
  const searchParams = useMemo(() => new URLSearchParams(paramsString), [paramsString]);
  const paramsObject = useMemo(() => Object.fromEntries(searchParams) as T, [searchParams]);

  const normalizeParams = useCallback(
    (params?: ParamsArg<T>) => {
      if (!params) return undefined;
      return typeof params === "function" ? params(paramsObject) : params;
    },
    [paramsObject]
  );

  const createParamsString = useCallback(
    (params?: ParamsArg<T>, { forced = false }: { forced?: boolean } = {}) => {
      const newParamsObject = { ...(!forced ? paramsObject : {}), ...normalizeParams(params) };
      const urlParams = new URLSearchParams(Object.entries(newParamsObject));

      for (const [key, value] of urlParams.entries()) {
        if (!value) {
          urlParams.delete(key);
        }
      }

      return urlParams.toString();
    },
    [paramsObject, normalizeParams]
  );

  const createParamsURL = useCallback(
    (...args: Parameters<typeof createParamsString>) => {
      const newParamsString = createParamsString(...args);
      return newParamsString ? `${path}?${newParamsString}` : path;
    },
    [path, createParamsString]
  );

  const getParamsByURL = useCallback(<T extends Record<any, any> = Record<any, any>>(url = "") => {
    const [, params] = url.split(paramsConnector);
    return params ? (Object.fromEntries(new URLSearchParams(params)) as T) : undefined;
  }, []);

  const deleteParams = useCallback(
    <K extends keyof T>(names: K | K[]) => {
      const [, paramsString] = window.location.href.split(paramsConnector);
      const newParams = Object.fromEntries(new URLSearchParams(paramsString)) as T;
      const namesToDelete = Array.isArray(names) ? names : [names];
      namesToDelete.forEach((name) => delete newParams[name]);

      navigate(createParamsURL(newParams, { forced: true }), undefined, {
        shallow: true,
        scroll: false
      });
    },
    [navigate, createParamsURL]
  );

  const setParams = useCallback(
    (
      params: Parameters<typeof createParamsString>[0],
      options?: {
        replace?: boolean;
        url?: Parameters<typeof createParamsString>[1];
        transition?: Parameters<typeof navigate>[2];
      }
    ) => {
      const { url, transition } = options ?? {};
      const _method = { navigate, replace }[options?.replace ? "replace" : "navigate"];
      const paramsURL = createParamsURL(params, url);
      _method(paramsURL, undefined, { shallow: true, scroll: false, ...transition });
      return paramsURL;
    },
    [navigate, replace, createParamsURL]
  );

  return useMemo(
    () => ({
      paramsString,
      paramsObject,
      query,
      getParamsByURL,
      createParamsURL,
      setParams,
      deleteParams,
      navigate,
      replace
    }),
    [
      paramsString,
      paramsObject,
      query,
      getParamsByURL,
      createParamsURL,
      setParams,
      deleteParams,
      navigate,
      replace
    ]
  );
}
