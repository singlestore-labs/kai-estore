import { AtomOptions, atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import upperFirst from "lodash.upperfirst";

export function createState<T = any>(
  name: string,
  defaultValue: T,
  {
    valueGetter,
    ...options
  }: Partial<AtomOptions<T>> & {
    valueGetter?: (defaultValue: T) => (...args: any[]) => Promise<T> | T;
  } = {},
) {
  const _atom = atom<T>({ key: name, ...options });

  const createKey = (key: string) => `${name}${upperFirst(key)}`;

  const valueSelector = selector({
    key: createKey("ValueSelector"),
    get: ({ get }) => get(_atom) ?? defaultValue,
    set: ({ set }, value) => set(_atom, value),
  });

  const _valueGetter = valueGetter?.(defaultValue) ?? (() => defaultValue);

  return {
    name,
    atom: _atom,
    defaultValue,
    valueSelector,
    createKey,
    getValue: _valueGetter,
    useState: () => useRecoilState(_atom),
    useValue: () => useRecoilValue(valueSelector),
    setValue: () => useSetRecoilState(valueSelector),
  };
}
