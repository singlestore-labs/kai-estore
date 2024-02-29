import { Fragment, useEffect, useMemo, useState } from "react";
import { Box, BoxProps, Button, Flex } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";
import { Product } from "@/types/api";

import { Rating } from "@/components/common/Rating";
import { Typography } from "@/components/common/Typography";
import { SkeletonWrapper } from "@/components/common/SkeletonWrapper";
import { Skeleton } from "@/components/common/Skeleton";

import { api } from "@/api";
import { cartState } from "@/state/cart";
import { useTimeoutLoading } from "@/hooks/useTimeoutLoading";
import { withRequestEvent } from "@/events/request";

import { ProductImage } from "./ProductImage";
import { ProductRate } from "./ProductRate";

export type ProductDetailsProps = ComponentProps<
  BoxProps,
  {
    productId?: Product["id"];
    onAddToCartClick?: () => void;
  }
>;

export function ProductDetails({ productId, onAddToCartClick, ...props }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | undefined>();
  const [cart, setCart] = cartState.useState();
  const { isLoading, startLoading, stopLoading } = useTimeoutLoading({ initialIsLoading: true });

  const inCart = useMemo(() => cart.products.some(({ id }) => id === productId), [cart.products, productId]);

  useEffect(() => {
    if (!productId) return;

    (async () => {
      try {
        startLoading();
        const res = await withRequestEvent(() => api.product.byItemId(productId));
        setProduct(res?.data[0]);
      } catch (error) {
        setProduct(undefined);
      } finally {
        stopLoading();
      }
    })();
  }, [productId, startLoading, stopLoading]);

  const handleAddToCartClick = () => {
    if (product) {
      setCart((cart) => ({ ...cart, products: [...cart.products, product] }));
    }

    onAddToCartClick?.();
  };

  if (isLoading || !product) {
    return (
      <SkeletonWrapper
        isOpen
        delay={400}
        display="flex"
        position="relative"
        gap="9"
        flexWrap="wrap"
      >
        <Skeleton
          flex="1 0 28.75rem"
          maxW="full"
          h="28.75rem"
        />
        <Box
          flex="1 0 27.5rem"
          maxW="full"
        >
          <Skeleton h="8" />
          <Skeleton
            w="20"
            h="7"
            mt="2"
          />
          <Skeleton
            w="20"
            h="5"
            mt="2"
          />
          <Skeleton
            w="10"
            h="6"
            mt="6"
          />
          <Skeleton
            h="36"
            mt="6"
          />
          <Skeleton
            w="56"
            h="16"
            mt="6"
          />
          <Skeleton
            w="72"
            h="10"
            mt="6"
          />
        </Box>
      </SkeletonWrapper>
    );
  }

  return (
    <Fragment>
      <Flex
        position="relative"
        alignItems="flex-start"
        flexWrap="wrap"
        gap="9"
        {...props}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          flex="1 0 28.75rem"
          maxW="full"
          bg="s2.misc.1"
        />

        <Flex
          flexDirection="column"
          flex="1 0 27.5rem"
          maxW="full"
        >
          <Typography
            as="h2"
            fontSize="2xl"
            lineHeight="8"
            fontWeight="semibold"
          >
            {product.name}
          </Typography>

          <Typography
            as="p"
            fontSize="xl"
            fontWeight="semibold"
            lineHeight="7"
            color="s2.gray.700"
            mt="2"
          >
            {product.category?.name}
          </Typography>

          <Rating
            value={product.rating}
            mt="2"
          />

          <Typography
            as="p"
            fontSize="md"
            fontWeight="semibold"
            lineHeight="6"
            mt="6"
          >
            {`$${product.price.toFixed(2)}`}
          </Typography>

          <Typography
            as="p"
            fontSize="md"
            lineHeight="6"
            mt="6"
          >
            {product.description}
          </Typography>

          {productId && (
            <ProductRate
              productId={productId}
              title="Review this product"
              mt="6"
            />
          )}

          <Button
            type="button"
            onClick={handleAddToCartClick}
            variant="solid"
            size="s2.md"
            w="full"
            maxW="300px"
            mt="6"
            isDisabled={!product || inCart}
          >
            Add to Cart
          </Button>
        </Flex>
      </Flex>
    </Fragment>
  );
}
