import { TrendingProduct } from "@/types/api";

import { api } from "@/api";
import { createState } from "@/utils/state";

export type TrendingProductsState = TrendingProduct[];

export const trendingProductsState = createState<TrendingProductsState>("trendingProductsState", [], {
  valueGetter: (defaultValue) => {
    return async (...args: Parameters<(typeof api.product)["trending"]>) => {
      try {
        return (await api.product.trending(...args)).data[0] ?? defaultValue;
      } catch (error) {
        return defaultValue;
      }
    };
  },
});
