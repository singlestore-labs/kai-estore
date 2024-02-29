import { selector, useRecoilValue } from "recoil";

import { TopProduct } from "@/types/api";
import { api } from "@/api";
import { createState } from "@/utils/state";

export type TopOneProductState = TopProduct;

export const topOneProductState = createState<TopOneProductState>(
  "topOneProductState",
  {
    id: "",
    name: "",
    image: "",
    sales: 0
  },
  {
    valueGetter: (defaultValue) => {
      return async (...args: Parameters<(typeof api.product)["topOne"]>) => {
        try {
          return (await api.product.topOne(...args)).data[0][0] ?? defaultValue;
        } catch (error) {
          return defaultValue;
        }
      };
    }
  }
);

const topOneProductStateItemId = selector({
  key: topOneProductState.createKey("id"),
  get: ({ get }) => get(topOneProductState.valueSelector).id
});

export function useTopOneProductStateItemdId() {
  return useRecoilValue(topOneProductStateItemId);
}
