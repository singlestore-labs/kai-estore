import { Fragment, ReactNode, useMemo, useRef } from "react";
import { Box, BoxProps, Flex } from "@chakra-ui/react";
import pick from "lodash.pick";

import { ComponentProps, UrlParams } from "@/types/common";
import { Product } from "@/types/api";

import { Typography } from "@/components/common/Typography";
import { Link, LinkProps } from "@/components/common/Link";

import { useSearchParams } from "@/hooks/useSearchParams";
import { createVariantsProps } from "@/utils/helpers";

import { ProductImage } from "./ProductImage";

type ProductVariants = "1" | "2" | "3" | "4";

export type ProductCardProduct = Pick<Product, "id" | "name" | "image"> &
  Partial<Pick<Product, "description" | "price" | "category">>;

export type ProductCardProps = ComponentProps<
  Omit<BoxProps, "children">,
  {
    variant?: ProductVariants;
    children?: ((id: Product["id"]) => ReactNode) | ReactNode;
  } & ProductCardProduct
>;

const variantsProps = createVariantsProps<ProductVariants>(() => ({
  "1": {
    imageWrapper: {
      bg: "s2.misc.1",
      mb: "3",
    },

    imageDecor: {
      display: "none",
    },

    price: {
      mt: "1.5",
    },
  },

  "2": {
    imageWrapper: {
      bg: "s2.misc.1",
      mb: "3",
    },

    content: {
      justifyContent: "space-between",
    },
  },

  "3": {
    card: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      gap: "3",
    },

    imageLink: {
      flex: "1",
      maxW: "150px",
    },

    imageWrapper: {
      bg: "s2.misc.1",
    },

    content: {
      flex: "1",
      pt: "2.5",
    },

    price: {
      mt: "3",
    },
  },

  "4": {
    imageDecor: {
      w: "full",
      h: "full",
      bg: "radial-gradient(50% 50% at 50% 50%, #E8E6F5 74.99%, rgba(192, 183, 235, 0) 75%);",
    },

    content: {
      alignItems: "center",
    },

    linkCategory: {
      display: "none",
    },

    price: {
      display: "none",
    },
  },
}));

function CardLink({ chakra, ...props }: LinkProps) {
  return <Link {...props} chakra={{ ...chakra, _hover: { textDecoration: "none", ...chakra?._hover } }} />;
}

export function ProductCard({
  children,
  variant = "1",
  id: id,
  name,
  category,
  price,
  image,
  ...props
}: ProductCardProps) {
  const { createParamsURL } = useSearchParams<Pick<UrlParams, "product" | "category" | "page">>();
  const variantProps = variantsProps()[variant];
  const childrenRef = useRef(children);

  const renderChildren = useMemo(() => {
    if (typeof childrenRef.current === "function") {
      return <Fragment>{childrenRef.current(id)}</Fragment>;
    }

    return childrenRef.current;
  }, [id]);

  const productLinkProps = {
    href: createParamsURL({ product: id }),
    shallow: true,
    scroll: false,
  };

  const imageDecor = (
    <Box
      as="span"
      display="block"
      position="absolute"
      top="0"
      left="0"
      zIndex="0"
      pointerEvents="none"
      {...variantProps?.imageDecor}
    />
  );

  const title = (
    <CardLink {...productLinkProps}>
      <Typography
        as="h4"
        fontSize="md"
        lineHeight="6"
        fontWeight="semibold"
        _hover={{ color: "s2.indigo.600" }}
      >
        {name}
      </Typography>
    </CardLink>
  );

  const _category = (
    <CardLink
      href={createParamsURL({ category: category?.name, page: "1" }, { forced: true })}
      scroll
      shallow
      chakra={{
        color: "s2.gray.600",
        _hover: { color: "s2.indigo.600" },
        ...variantProps?.linkCategory,
      }}
    >
      <Typography as="h5" fontSize="md" lineHeight="6" fontWeight="normal" color="inherit">
        {category?.name}
      </Typography>
    </CardLink>
  );

  const _price = (
    <Typography as="p" fontSize="md" fontWeight="semibold" {...variantProps?.price}>
      {`$${price?.toFixed(2)}`}
    </Typography>
  );

  let content = (
    <Flex
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      {...variantProps?.content}
    >
      {title}
      {_category}
      {_price}
    </Flex>
  );

  if (variant === "2") {
    content = (
      <Flex
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="flex-start"
        {...variantProps?.content}
      >
        <Box>
          {title}
          {_category}
        </Box>
        {_price}
      </Flex>
    );
  }

  return (
    <Box
      position="relative"
      w="full"
      maxW="full"
      _hover={{ ".image": { transform: `scale(1.1)` } }}
      {...variantProps?.card}
      {...props}
    >
      <CardLink {...productLinkProps} chakra={variantProps?.imageLink}>
        <ProductImage src={image} alt={name} {...variantProps?.imageWrapper}>
          {imageDecor}
        </ProductImage>
      </CardLink>

      {content}
      {renderChildren}
    </Box>
  );
}

export function pickProductCardFields<T extends Record<any, any>>(product: T) {
  return pick(product, ["id", "name", "image", "description", "price", "category"]) as ProductCardProduct;
}
