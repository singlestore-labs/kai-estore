import { selector, useRecoilValue } from "recoil";

import { Product } from "@/types/api";
import { api } from "@/api";
import { createState } from "@/utils/state";

export type ProductPricesState = Product["price"][];

export const productPricesState = createState<ProductPricesState>("productPricesState", [], {
  valueGetter: (defaultValue) => {
    return async (...args: Parameters<(typeof api.product)["prices"]>) => {
      try {
        return (await api.product.prices(...args)).data ?? defaultValue;
      } catch (error) {
        return defaultValue;
      }
    };
  }
});

const productPricesStateRanges = selector({
  key: productPricesState.createKey("ranges"),
  get: ({ get }) => {
    const prices = get(productPricesState.valueSelector);
    const round = (number: number) => Math.round(number / offset) * offset;

    const offset = 50;
    const min = round(Math.min(...prices));
    const max = round(Math.max(...prices));

    return ([min, ...Array.from({ length: (max - min) / offset }), max] as number[]).reduce(
      (ranges, price, i) => {
        let prev = ranges[i - 1]?.[1] ?? price - offset;
        let current = price ?? prev + offset;

        if (!Number.isInteger(prev)) prev = 0;
        if (!Number.isInteger(current)) current = 0;

        if (prev === max) return ranges;

        return [...ranges, [prev, current]];
      },
      [] as number[][]
    );
  }
});

const productPricesStateOptions = selector({
  key: productPricesState.createKey("options"),
  get: ({ get }) => {
    return get(productPricesStateRanges).map((range) => {
      const value = range.join("-");
      const label = value.replace(/(^|-)/g, (is) => (is === "-" ? `${is}$` : `$${is}`));
      return { label, value };
    });
  }
});

export function useProductPricesStateOptions() {
  return useRecoilValue(productPricesStateOptions);
}
