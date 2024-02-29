import { useEffect, useMemo, useRef } from "react";
import { Box, BoxProps, Divider, Flex } from "@chakra-ui/react";
import { diff } from "deep-object-diff";
import pick from "lodash.pick";

import { ComponentProps, UrlParams } from "@/types/common";

import { ProductList } from "@/components/Product/List/ProductList";
import { Pagination } from "@/components/common/Pagination";

import { api } from "@/api";
import { categoriesState } from "@/state/categories";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchParams } from "@/hooks/useSearchParams";
import { tagsState } from "@/state/tags";
import { productsState, urlParamsToProductParams } from "@/state/products";
import { useTimeoutLoading } from "@/hooks/useTimeoutLoading";
import { withRequestEvent } from "@/events/request";

export type CatalogProductsProps = ComponentProps<BoxProps>;

type CatalogParamKeys = Extract<keyof UrlParams, "category" | "tag" | "price" | "rating" | "page" | "sort">;

const catalogParams: CatalogParamKeys[] = ["category", "tag", "price", "rating", "page", "sort"];

const instantParams = catalogParams.filter((param) => param === "page" || param === "sort");

function getDelay(changedParam?: CatalogParamKeys) {
  if (!changedParam) return 1000;
  return instantParams.includes(changedParam) ? 0 : 1000;
}

export function CatalogProducts({ ...props }: CatalogProductsProps) {
  const { paramsObject } = useSearchParams<UrlParams>();

  const categories = categoriesState.useValue();
  const tags = tagsState.useValue();
  const [{ products, total }, setProducts] = productsState.useState();
  const prevParamsObject = useRef(paramsObject);
  const pagesNumber = Math.ceil(total / 12);
  const { isLoading, startLoading, stopLoading } = useTimeoutLoading({ delay: 400 });

  const changedParam = useMemo(() => {
    const param = Object.keys(pick(diff(prevParamsObject.current, paramsObject), catalogParams))[0];
    return param as CatalogParamKeys;
  }, [paramsObject]);

  const fetchProductsDebounced = useDebounce(async () => {
    try {
      startLoading();

      const res = await withRequestEvent(
        () => api.product.filter(urlParamsToProductParams(paramsObject, categories, tags)),
        "Filter products"
      );

      if (res?.data[0].total) setProducts(res.data[0]);
    } catch (error) {
      setProducts({ products: [], total: 0 });
    } finally {
      stopLoading();
    }
  }, getDelay(changedParam));

  useEffect(() => {
    if (changedParam) {
      fetchProductsDebounced();
      prevParamsObject.current = paramsObject;
    }
  }, [changedParam, paramsObject, fetchProductsDebounced]);

  return (
    <Box
      position="relative"
      {...props}
    >
      <ProductList
        variant="1"
        products={products}
        skeletonWrapperProps={{ number: 12 }}
        isLoading={isLoading}
      />

      <Divider mt="6" />

      <Flex
        w="full"
        alignItems="center"
        justifyContent="center"
        mt="4"
      >
        <Pagination pagesNumber={pagesNumber} />
      </Flex>
    </Box>
  );
}
