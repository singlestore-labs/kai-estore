import { selector, useRecoilValue } from "recoil";

import { Product } from "@/types/api";
import { createState } from "@/utils/state";

export type CartState = { products: Product[] };

export const cartState = createState<CartState>("cartState", { products: [] });

const cartStateProducts = selector({
  key: cartState.createKey("products"),
  get: ({ get }) => get(cartState.valueSelector).products,
});

const cartStateProductsLength = selector({
  key: cartState.createKey("productsLength"),
  get: ({ get }) => get(cartStateProducts).length,
});

export function useCartStateProducts() {
  return useRecoilValue(cartStateProducts);
}

export function useCartStateProductsLength() {
  return useRecoilValue(cartStateProductsLength);
}
