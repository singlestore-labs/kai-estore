import { useEffect, useRef, useState } from "react";

import { ComponentProps } from "@/types/common";
import { Product, RelatedProduct } from "@/types/api";
import { api } from "@/api";
import { apiRequestToken } from "@/api/instance";
import { withRequestEvent } from "@/events/request";
import { useTimeoutLoading } from "@/hooks/useTimeoutLoading";
import { ProductList, ProductListProps } from "./ProductList";

export type ProductListRelatedProps = ComponentProps<
  Omit<ProductListProps, "children" | "products">,
  {
    productId?: Product["id"];
    skeletonDelay?: number;
    initialIsLoading?: boolean;
    withRequestCompare?: boolean;
  }
>;

export function ProductListRelated({
  productId,
  skeletonDelay = 0,
  initialIsLoading = true,
  withRequestCompare = false,
  ...props
}: ProductListRelatedProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const { isLoading, startLoading, stopLoading } = useTimeoutLoading({ initialIsLoading: initialIsLoading });

  const requestTokenRef = useRef<ReturnType<typeof apiRequestToken>>();

  useEffect(() => {
    if (!productId) return;

    requestTokenRef.current = apiRequestToken();

    (async () => {
      startLoading();
      try {
        const res = await withRequestEvent(
          () => api.product.relatedProducts(productId, {}, { cancelToken: requestTokenRef.current?.token }),
          withRequestCompare ? "Customers also bought" : undefined
        );

        if (res?.data[0].length) setProducts(res.data[0]);
      } catch (error) {
        setProducts([]);
      } finally {
        stopLoading();
      }
    })();
  }, [productId, startLoading, stopLoading, withRequestCompare]);

  useEffect(
    () => () => {
      requestTokenRef.current?.cancel();
    },
    []
  );

  return (
    <ProductList
      variant="2"
      {...props}
      products={products}
      isLoading={isLoading}
      skeletonWrapperProps={{ number: 5, delay: skeletonDelay }}
    />
  );
}
