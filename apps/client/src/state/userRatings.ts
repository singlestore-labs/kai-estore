import { Rating } from "@/types/api";

import { api } from "@/api";
import { createState } from "@/utils/state";

export type UserRatingsState = Rating[];

export const userRatingsState = createState<UserRatingsState>("userRatingsState", [], {
  valueGetter: (defaultValue) => {
    return async (...args: Parameters<typeof api.user.ratings>) => {
      return (await api.user.ratings(...args)).data ?? defaultValue;
    };
  }
});
