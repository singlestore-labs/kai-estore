import { api } from "@/api";
import { cdcState } from "@/state/cdc";
import { useIsConnectionExist } from "@/state/connection";
import { useEffect } from "react";

export function CDCController() {
  const isConnectionExist = useIsConnectionExist();
  const setCDC = cdcState.setValue();

  useEffect(() => {
    if (!isConnectionExist) {
      setCDC({ status: "pending" });
      return;
    }

    (async () => {
      try {
        const state = await api.cdc.get({ connection: "config" });
        setCDC(state.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [isConnectionExist, setCDC]);

  return null;
}
