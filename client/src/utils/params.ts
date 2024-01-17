export const urlParamDelimeter = ",";

export function normalizeUrlParam<T extends string>(value?: T) {
  if (!value) return [];
  return value?.split(urlParamDelimeter);
}

export function serializeUrlParam<T = any>(value: T) {
  if (!value) return [];

  if (value && !Array.isArray(value)) {
    return [value];
  }

  return value;
}
