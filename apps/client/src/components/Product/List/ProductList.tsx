import { Fragment, ReactNode, useMemo } from "react";
import { Box, Divider, StackProps } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";
import { Defined } from "@/types/helpers";

import { Skeleton, SkeletonProps } from "@/components/common/Skeleton";
import { SkeletonWrapper } from "@/components/common/SkeletonWrapper";

import { createVariantsProps } from "@/utils/helpers";

import { ProductCard, ProductCardProduct, ProductCardProps, pickProductCardFields } from "../ProductCard";

export type ProductListProps<
  T extends Pick<ProductCardProduct, "id" | "name"> = Pick<ProductCardProduct, "id" | "name">
> = ComponentProps<
  StackProps,
  {
    variant?: ProductCardProps["variant"];
    products: T[];
    cardChildren?: ProductCardProps["children"];
    withDivider?: boolean;
    isLoading?: boolean;
    skeletonWrapperProps?: {
      number?: number;
      delay?: number;
    };
    skeletonProps?: SkeletonProps;
  }
>;

const variantsProps = createVariantsProps<Defined<ProductListProps["variant"]>>(() => ({
  "1": {
    list: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(19.375rem, 19.75rem))",
      gap: "4",
      rowGap: "14"
    }
  },

  "2": {
    list: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 11.1rem))",
      gap: "3",
      rowGap: "10"
    }
  },

  "3": {
    list: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(18.875rem, 1fr))",
      gap: "3",
      rowGap: "3"
    },

    divider: {
      my: "3",

      __css: {
        "&:last-of-type": {
          mb: "0"
        }
      }
    }
  },

  "4": {
    list: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 14.90rem))",
      gap: "3"
    }
  }
}));

export function ProductList({
  variant = "1",
  products = [],
  cardChildren,
  withDivider = false,
  isLoading = false,
  skeletonWrapperProps,
  skeletonProps,
  ...props
}: ProductListProps) {
  const variantProps = variantsProps()[variant];

  const _products = useMemo(() => {
    return products.map((product) => pickProductCardFields(product));
  }, [products]);

  let divider: ReactNode;
  if (withDivider) {
    divider = <Divider {...variantProps.divider} />;
  }

  if (isLoading) {
    return (
      <SkeletonWrapper
        {...variantProps.list}
        {...props}
        isOpen
        delay={skeletonWrapperProps?.delay}
        position="relative"
        overflowX="hidden"
        overflowY="auto"
      >
        {Array.from({ length: skeletonWrapperProps?.number ?? 1 }).map((_, i) => (
          <Skeleton
            key={i}
            ratio={100}
            {...skeletonProps}
          />
        ))}
      </SkeletonWrapper>
    );
  }

  return (
    <Box
      position="relative"
      overflowX="hidden"
      overflowY="auto"
      {...variantProps.list}
      {...props}
    >
      {_products.map((product) => (
        <Fragment key={product.id}>
          <ProductCard
            {...product}
            variant={variant}
            {...variantProps.productCard}
          >
            {cardChildren}
          </ProductCard>
          {divider}
        </Fragment>
      ))}
    </Box>
  );
}
