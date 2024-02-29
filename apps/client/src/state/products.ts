import { selector, useRecoilValue } from "recoil";

import { Product } from "@/types/api";
import { UrlParams } from "@/types/common";
import { api } from "@/api";
import { createState } from "@/utils/state";
import { normalizeUrlParam } from "@/utils/params";
import { CategoriesState } from "./categories";
import { TagsState } from "./tags";

export type ProductsState = { products: Product[]; total: number };

export const productsState = createState<ProductsState>(
  "productsState",
  { products: [], total: 0 },
  {
    valueGetter: (defaultValue) => {
      return async (requestArgs: Parameters<(typeof api.product)["filter"]>) => {
        try {
          return (await api.product.filter(...requestArgs)).data[0] ?? defaultValue;
        } catch (error) {
          return defaultValue;
        }
      };
    }
  }
);

const productsStateTotal = selector({
  key: productsState.createKey("total"),
  get: ({ get }) => get(productsState.valueSelector).total
});

export function useProductsStateTotal() {
  return useRecoilValue(productsStateTotal);
}

export function urlParamsToProductParams(params?: UrlParams, categories?: CategoriesState, tags?: TagsState) {
  return {
    category: categories ? normalizeUrlParam(params?.category).map((name) => categories[name].id) : undefined,
    tag: tags ? normalizeUrlParam(params?.tag).map((name) => tags[name].id) : undefined,
    price: normalizeUrlParam(params?.price),
    rating: normalizeUrlParam(params?.rating),
    page: params?.page,
    sort: params?.sort
  };
}
