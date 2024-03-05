import { createState } from "@/utils/state";
import { cookies } from "@/utils/cookies";

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
