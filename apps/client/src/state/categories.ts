import { selector, useRecoilValue } from "recoil";

import { Category } from "@/types/api";
import { api } from "@/api";
import { createState } from "@/utils/state";

export type CategoriesState = Record<Category["name"], Category>;

export const categoriesState = createState<CategoriesState>(
  "categoriesState",
  {},
  {
    valueGetter: (defaultValue) => {
      return async (...args: Parameters<(typeof api.category)["getMany"]>) => {
        try {
          const value = defaultValue;
          const categoriesData = (await api.category.getMany(...args)).data;

          for (const category of categoriesData) {
            value[category.name] = category;
          }

          return value;
        } catch (error) {
          return defaultValue;
        }
      };
    }
  }
);

const categoriesStateOptions = selector({
  key: categoriesState.createKey("options"),
  get: ({ get }) => {
    return Object.values(get(categoriesState.valueSelector)).map(({ name }) => ({
      label: name,
      value: name
    }));
  }
});

export function useCategoryStateOptions() {
  return useRecoilValue(categoriesStateOptions);
}
