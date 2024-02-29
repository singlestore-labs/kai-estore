import { Button, ButtonProps } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Typography } from "@/components/common/Typography";
import { Icon } from "@/components/common/Icon";

import { useCartStateProductsLength } from "@/state/cart";

export type CartTogglerProps = ComponentProps<ButtonProps>;

export function CartToggler({ ...props }: CartTogglerProps) {
  const cartProductsLength = useCartStateProductsLength();

  let number;
  if (cartProductsLength) {
    number = (
      <Typography
        as="span"
        className="cartNumber"
        color="s2.gray.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        top="10%"
        right="10%"
        fontSize="0.5625rem"
        w="3.5"
        h="3.5"
        bg="s2.gray.300"
        borderRadius="full"
      >
        {cartProductsLength}
      </Typography>
    );
  }

  return (
    <Button
      className="cartToggler"
      borderRadius="full"
      bg="none"
      px="4"
      py="3"
      variant="ghost"
      {...props}
    >
      <Icon
        name="solid.faCartShopping"
        w="4"
      />
      {number}
    </Button>
  );
}
