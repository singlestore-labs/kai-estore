import { createState } from "@/utils/state";
import { api } from "@/api";
import { CDC } from "@/types/api";

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
