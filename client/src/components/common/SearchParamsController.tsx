import { Fragment, ReactNode, useCallback, useMemo, useRef } from "react";

import { UrlParams } from "@/types/common";

import { useSearchParams } from "@/hooks/useSearchParams";
import { useDebounce } from "@/hooks/useDebounce";
import { normalizeUrlParam, urlParamDelimeter } from "@/utils/params";

export type SearchParamsControllerProps = {
  paramName: keyof UrlParams;
  children: (value?: any, onChange?: (value: any) => void) => ReactNode;
  wait?: number;
};

export function SearchParamsController({ children, paramName, wait = 0 }: SearchParamsControllerProps) {
  const { paramsObject, setParams } = useSearchParams<Pick<UrlParams, typeof paramName>>();

  const childrenRef = useRef(children);
  const paramValue = paramsObject[paramName];

  const value = useMemo(() => {
    if (paramValue?.includes(urlParamDelimeter)) {
      return normalizeUrlParam(paramValue);
    }

    return paramValue;
  }, [paramValue]);

  const setParamsDebounce = useDebounce((value: any = "") => {
    setParams({ [paramName]: value, page: "1" });
  }, wait);

  const handleChange = useCallback<(value: any) => void>(
    (value) => setParamsDebounce(value),
    [setParamsDebounce],
  );

  return useMemo(
    () => <Fragment>{childrenRef.current({ value, onChange: handleChange })}</Fragment>,
    [value, handleChange],
  );
}
