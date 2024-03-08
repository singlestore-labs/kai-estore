import { createState } from "@/utils/state";
import { api } from "@/api";
import { CDC } from "@/types/api";
import { selector, useRecoilValue } from "recoil";

export type CDCState = CDC;

export const cdcState = createState<CDCState>(
  "cdcState",
  { status: "ready" },
  {
    valueGetter: (defaultValue) => {
      return async (...args: Parameters<(typeof api.cdc)["get"]>) => {
        try {
          return (await api.cdc.get(...args)).data ?? defaultValue;
        } catch (error) {
          return defaultValue;
        }
      };
    }
  }
);

const cdcStatus = selector({
  key: cdcState.createKey("status"),
  get: ({ get }) => get(cdcState.valueSelector).status
});

export function useCDCStatus() {
  return useRecoilValue(cdcStatus);
}
