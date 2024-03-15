import { selector, useRecoilValue } from "recoil";

import { Product } from "@/types/api";
import { api } from "@/api";
import { createState } from "@/utils/state";

export type ProductRatingsState = Product["rating"][];

export const productRatingsState = createState<ProductRatingsState>("productRatingsState", [], {
  valueGetter: (defaultValue) => {
    return async (...args: Parameters<(typeof api.product)["ratings"]>) => {
      try {
        return (await api.product.ratings(...args)).data ?? defaultValue;
      } catch (error) {
        return defaultValue;
      }
    };
  }
});

const productRatingsStateOptions = selector({
  key: productRatingsState.createKey("options"),
  get: ({ get }) => {
    const ratings = get(productRatingsState.valueSelector);
    return ratings?.map((rating) => ({ label: `${rating} stars`, value: `${rating}` })).reverse() || [];
  }
});

export function useProductRatingsStateOptions() {
  return useRecoilValue(productRatingsStateOptions);
}
