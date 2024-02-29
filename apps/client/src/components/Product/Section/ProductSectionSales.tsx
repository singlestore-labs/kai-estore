import { useEffect, useRef, useState } from "react";

import { ComponentProps } from "@/types/common";
import { Product } from "@/types/api";

import { Section, SectionProps } from "@/components/common/Section";
import { Chart, ChartProps } from "@/components/common/Chart";

import { api } from "@/api";
import { apiRequestToken } from "@/api/instance";
import { useTimeoutLoading } from "@/hooks/useTimeoutLoading";
import { SkeletonWrapper } from "@/components/common/SkeletonWrapper";
import { Skeleton } from "@/components/common/Skeleton";
import { withRequestEvent } from "@/events/request";

export type ProductSectionSalesProps = ComponentProps<SectionProps, { productId?: Product["id"] }>;

export function ProductSectionSales({ productId, ...props }: ProductSectionSalesProps) {
  const [sales, setSales] = useState<ChartProps["data"]>();
  const { isLoading, startLoading, stopLoading } = useTimeoutLoading({ initialIsLoading: true });

  const requestTokenRef = useRef<ReturnType<typeof apiRequestToken>>();

  useEffect(() => {
    if (!productId) return;

    (async () => {
      requestTokenRef.current = apiRequestToken();

      try {
        startLoading();

        const res = await withRequestEvent(
          () => api.product.sales(productId, {}, { cancelToken: requestTokenRef.current?.token }),
          "Product sales"
        );

        if (res?.data[0].length) setSales(res.data[0].map((sale) => ({ date: sale.day, sales: sale.count })));
      } catch (error) {
        setSales(undefined);
      } finally {
        stopLoading();
      }
    })();
  }, [productId, startLoading, stopLoading]);

  useEffect(
    () => () => {
      requestTokenRef.current?.cancel();
    },
    []
  );

  let content;
  if (isLoading) {
    content = (
      <SkeletonWrapper
        isOpen
        delay={400}
      >
        <Skeleton ratio={20.52} />
      </SkeletonWrapper>
    );
  } else {
    content = <Chart data={sales} />;
  }

  return (
    <Section
      title="Product popularity over 90 days"
      {...props}
      containerProps={{ p: "0", ...props.containerProps }}
    >
      {content}
    </Section>
  );
}
