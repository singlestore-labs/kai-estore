import { selector, useRecoilValue } from "recoil";

import { Tag } from "@/types/api";
import { api } from "@/api";
import { createState } from "@/utils/state";

export type TagsState = Record<Tag["name"], Tag>;

export const tagsState = createState<TagsState>(
  "tagsState",
  {},
  {
    valueGetter: (defaultValue) => {
      return async (...args: Parameters<(typeof api.tag)["getMany"]>) => {
        try {
          const value = defaultValue;
          const tagsData = (await api.tag.getMany(...args)).data;

          for (const tag of tagsData) {
            value[tag.name] = tag;
          }

          return value;
        } catch (error) {
          return defaultValue;
        }
      };
    },
  },
);

const tagsStateOptions = selector({
  key: tagsState.createKey("options"),
  get: ({ get }) => {
    return Object.values(get(tagsState.valueSelector)).map(({ name }) => ({ label: name, value: name }));
  },
});

export function useTagsStateOptions() {
  return useRecoilValue(tagsStateOptions);
}
