import { useEffect, useRef } from "react";

import { ComponentProps } from "@/types/common";

import { userRecommProductsState } from "@/state/userRecommProducts";
import { useTimeoutLoading } from "@/hooks/useTimeoutLoading";
import { ioEvents } from "@/events/io";

import { api } from "@/api";
import { apiRequestToken } from "@/api/instance";
import { withRequestEvent } from "@/events/request";

import { ProductList, ProductListProps } from "./ProductList";

export type ProductListRecommProps = ComponentProps<
  Omit<ProductListProps, "children" | "products" | "skeletonWrapperProps">
>;

export function ProductListRecomm({ ...props }: ProductListRecommProps) {
  const [products, setProducts] = userRecommProductsState.useState();
  const { isLoading, setLoading } = useTimeoutLoading({ delay: 0, initialIsLoading: true });

  const requestTokenRef = useRef<ReturnType<typeof apiRequestToken>>();

  useEffect(() => {
    requestTokenRef.current = apiRequestToken();

    (async () => {
      try {
        setLoading(true);

        const res = await withRequestEvent(() =>
          api.user.recommProducts({ cancelToken: requestTokenRef.current?.token })
        );

        if (res?.data[0]) setProducts(res.data[0]);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [setLoading, setProducts]);

  useEffect(
    () => () => {
      requestTokenRef.current?.cancel();
    },
    []
  );

  useEffect(() => {
    const removeOnLoading = ioEvents.recomm.onLoading(setLoading);
    const removeOnData = ioEvents.recomm.onData((data) => {
      const products = data[0];

      if (products?.length) {
        setProducts(products);
      }

      setLoading(false);
    });

    return () => {
      removeOnLoading();
      removeOnData();
    };
  }, [setProducts, setLoading]);

  return (
    <ProductList
      variant="4"
      {...props}
      products={products}
      skeletonWrapperProps={{ number: 5, delay: 500 }}
      skeletonProps={{ borderRadius: "full" }}
      isLoading={isLoading}
    />
  );
}
