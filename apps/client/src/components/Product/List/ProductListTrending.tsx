import { useEffect, useRef } from "react";
import { ComponentProps } from "@/types/common";

import { ProductList, ProductListProps } from "./ProductList";

import { trendingProductsState } from "@/state/trendingProducts";
import { apiRequestToken } from "@/api/instance";

export type ProductListTrendingProps = ComponentProps<
  Omit<ProductListProps, "children" | "products" | "skeletonWrapperProps">
>;

export function ProductListTrending({ ...props }: ProductListTrendingProps) {
  const [state, setState] = trendingProductsState.useState();
  const requestTokenRef = useRef<ReturnType<typeof apiRequestToken>>();

  useEffect(() => {
    (async () => {
      try {
        requestTokenRef.current = apiRequestToken();
        setState((i) => ({ ...i, isLoading: true }));
        setState(
          await trendingProductsState.getValue({ number: 5 }, { cancelToken: requestTokenRef.current?.token })
        );
      } catch (error) {
        setState((i) => ({ ...i, products: [], isLoading: false }));
      }
    })();
  }, [setState]);

  useEffect(
    () => () => {
      requestTokenRef.current?.cancel();
    },
    []
  );

  return (
    <ProductList
      variant="4"
      {...props}
      products={state.products}
      skeletonWrapperProps={{ number: 5, delay: 500 }}
      skeletonProps={{ borderRadius: "full" }}
      isLoading={state.isLoading}
    />
  );
}
