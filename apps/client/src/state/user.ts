import { selector, useRecoilValue } from "recoil";

import { createState } from "@/utils/state";

import { userOrdersState } from "./userOrders";
import { userRatingsState } from "./userRatings";

export type UserState = object;

export type UserStateName = typeof userStateName;

export const userStateName = "userState";

export const userState = createState<UserState>("userState", {}, {});

const userStateHistory = selector({
  key: userState.createKey("history"),
  get: ({ get }) => ({
    orders: get(userOrdersState.valueSelector),
    ratings: get(userRatingsState.valueSelector)
  })
});

const userStateHasHistory = selector({
  key: userState.createKey("hasHistory"),
  get: ({ get }) => Boolean(Object.values(get(userStateHistory)).flat().length)
});

export function useUserStateHasHistory() {
  return useRecoilValue(userStateHasHistory);
}
