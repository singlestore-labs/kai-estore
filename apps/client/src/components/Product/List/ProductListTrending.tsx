import { ComponentProps } from "@/types/common";

import { ProductList, ProductListProps } from "./ProductList";

import { trendingProductsState } from "@/state/trendingProducts";

export type ProductListTrendingProps = ComponentProps<
  Omit<ProductListProps, "children" | "products" | "skeletonWrapperProps">
>;

export function ProductListTrending({ ...props }: ProductListTrendingProps) {
  const trendingProducts = trendingProductsState.useValue();

  return (
    <ProductList
      variant="4"
      {...props}
      products={trendingProducts}
      skeletonWrapperProps={{ number: 5, delay: 500 }}
      skeletonProps={{ borderRadius: "full" }}
    />
  );
}
