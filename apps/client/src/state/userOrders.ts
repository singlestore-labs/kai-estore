import { Order } from "@/types/api";

import { api } from "@/api";
import { createState } from "@/utils/state";

export type UserOrdersState = Order[];

export const userOrdersState = createState<UserOrdersState>("userOrdersState", [], {
  valueGetter: (defaultValue) => {
    return async (...args: Parameters<typeof api.user.orders>) => {
      return (await api.user.orders(...args)).data ?? defaultValue;
    };
  }
});
