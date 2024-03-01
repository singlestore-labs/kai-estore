import { TrendingProduct } from "@/types/api";

import { api } from "@/api";
import { createState } from "@/utils/state";

export type TrendingProductsState = { products: TrendingProduct[]; isLoading?: boolean };

export const trendingProductsState = createState<TrendingProductsState>(
  "trendingProductsState",
  { products: [], isLoading: false },
  {
    valueGetter: (defaultValue) => {
      return async (...args: Parameters<(typeof api.product)["trending"]>) => {
        try {
          return { products: (await api.product.trending(...args)).data[0], isLoading: false } ?? defaultValue;
        } catch (error) {
          return defaultValue;
        }
      };
    }
  }
);
