import { MutableSnapshot } from "recoil";

import { objectEntries } from "@/utils/helpers";

import { cartState } from "./cart";
import { categoriesState } from "./categories";
import { productPricesState } from "./productPrices";
import { productRatingsState } from "./productRatings";
import { productsState } from "./products";
import { tagsState } from "./tags";
import { topOneProductState } from "./topOneProduct";
import { trendingProductsState } from "./trendingProducts";
import { userState } from "./user";
import { userOrdersState } from "./userOrders";
import { userRatingsState } from "./userRatings";
import { userRecommProductsState } from "./userRecommProducts";
import { connectionState } from "./connection";
import { cdcState } from "./cdc";

type States = typeof states;
export type RootState = { [K in keyof States]: States[K] };
export type RootStateValues = { [K in keyof RootState]: RootState[K]["defaultValue"] };

const states = {
  cartState,
  categoriesState,
  productPricesState,
  productRatingsState,
  productsState,
  tagsState,
  topOneProductState,
  trendingProductsState,
  userState,
  userOrdersState,
  userRatingsState,
  userRecommProductsState,
  connectionState,
  cdcState
};

const stateEntries = objectEntries(states);

export function initializeRecoilState<T extends RootStateValues>(rootState?: T) {
  return ({ set }: MutableSnapshot) => {
    for (const [key, state] of stateEntries) {
      set(state.atom as any, rootState?.[key] ?? state.defaultValue);
    }
  };
}
