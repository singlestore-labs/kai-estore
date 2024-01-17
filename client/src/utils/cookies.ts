import Cookies from "js-cookie";
import cookie, { CookieSerializeOptions } from "cookie";

import { COOKIE_KEYS } from "@/constants/cookie";

export type CookieKeys = keyof typeof COOKIE_KEYS;

export type Cookies = { [K in CookieKeys]?: string };

function set<T extends string = CookieKeys, V extends string = string>(key: T, value: V) {
  return Cookies.set(key, value);
}

function get<V extends string | undefined = string | undefined, T extends string = CookieKeys>(key: T) {
  return Cookies.get(key) as V;
}

function remove<T extends string = CookieKeys>(key: T) {
  return Cookies.remove(key);
}

function parse<T extends object = Cookies>(value?: string) {
  if (!value) return undefined;
  return cookie.parse(value) as T;
}

function serialize<T extends string = CookieKeys>(
  key: T,
  value: T extends CookieKeys ? Cookies[T] : string,
  options?: CookieSerializeOptions,
) {
  return cookie.serialize(key, value, options);
}

export const cookies = { set, get, remove, parse, serialize };
