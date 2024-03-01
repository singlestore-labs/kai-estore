import { useEffect } from "react";
import { topOneProductState } from "@/state/topOneProduct";

export function StateDataProvider() {
  const [_topOneProductState, setTopOneProductState] = topOneProductState.useState();

  useEffect(() => {
    (async () => {
      await Promise.all(
        [
          async () => {
            if (_topOneProductState.id) return;

            try {
              const state = await topOneProductState.getValue();
              setTopOneProductState(state);
            } catch (error) {
              setTopOneProductState(topOneProductState.defaultValue);
            }
          }
        ].map((fn) => fn())
      );
    })();
  }, [_topOneProductState.id, setTopOneProductState]);

  return null;
}
