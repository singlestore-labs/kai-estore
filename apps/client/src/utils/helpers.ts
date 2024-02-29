import { ChakraProps } from "@chakra-ui/react";
import mergeWith from "lodash.mergewith";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";
import humanizeDuration from "humanize-duration";

import { AnyFunction } from "@/types/helpers";

type VariantStyle<T extends string = string> = Record<T, ChakraProps>;

export function createVariantProps<T extends VariantStyle>(props: T) {
  return props;
}

export function createVariantsProps<
  T extends string,
  K extends (...args: any[]) => Record<T, VariantStyle> = (...args: any[]) => Record<T, VariantStyle>
>(props: K) {
  return props;
}

export function extendVariantProps<T extends VariantStyle>(
  source: T,
  value: { [K in keyof T]?: ChakraProps } & Record<string, ChakraProps>
) {
  return mergeWith({}, source, value);
}

export function objectEntries<T extends object>(object: T) {
  return Object.entries(object) as { [K in keyof T]: [K, T[K]] }[keyof T][];
}

export function getRandomNumber(to: number, from = 0) {
  return Math.floor(Math.random() * to) + from;
}

export function getRandomIndex(length: number, lastIndex?: number): number {
  const _lastIndex = lastIndex || length;
  const index = getRandomNumber(length);
  return _lastIndex === index ? getRandomIndex(length, _lastIndex) : index;
}

export function isInViewport<T extends Element | null>(element?: T) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export async function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

export const durationHumanizer = humanizeDuration.humanizer({
  spacer: "",
  language: "short",
  languages: {
    short: {
      m: () => "m",
      s: (count) => (count?.toString()[0] === "0" ? "ms" : "s"),
      ms: () => "ms"
    }
  }
});

export async function withDuration<T extends AnyFunction>(callback: T) {
  const startTime = performance.now();
  const result = await callback();
  const diff = differenceInMilliseconds(startTime, performance.now());
  let duration = durationHumanizer(diff);
  duration = duration.match(/^0./) ? duration.split(/^0./)[1] : duration;
  return [result, duration] as [ReturnType<T>, string];
}
