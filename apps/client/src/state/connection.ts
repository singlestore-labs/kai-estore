import { createState } from "@/utils/state";
import { cookies } from "@/utils/cookies";
import { selector, useRecoilValue } from "recoil";

export type ConnectionState = { isExist: boolean };

export const connectionState = createState<ConnectionState>(
  "connectionState",
  { isExist: false },
  {
    valueGetter: (defaultValue) => {
      return (payload?: ConnectionState) => {
        try {
          const isExist = !!cookies.get("connectionConfig");
          return { isExist, ...payload };
        } catch (error) {
          return defaultValue;
        }
      };
    }
  }
);

const isConnectionExist = selector({
  key: connectionState.createKey("isExist"),
  get: ({ get }) => get(connectionState.valueSelector).isExist
});

export function useIsConnectionExist() {
  return useRecoilValue(isConnectionExist);
}
