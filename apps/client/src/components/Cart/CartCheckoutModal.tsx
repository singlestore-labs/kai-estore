import { Box, Button, Divider, Flex } from "@chakra-ui/react";

import { Product } from "@/types/api";
import { ComponentProps } from "@/types/common";

import { Modal, ModalProps } from "@/components/common/Modal";
import { Typography } from "@/components/common/Typography";
import { Icon } from "@/components/common/Icon";
import { ProductList } from "@/components/Product/List/ProductList";
import { ProductSectionRelated } from "@/components/Product/Section/ProductSectionRelated";

import { api } from "@/api";
import { ioEvents } from "@/events/io";
import { cartState, useCartStateProducts } from "@/state/cart";
import { userOrdersState } from "@/state/userOrders";
import { useTimeoutLoading } from "@/hooks/useTimeoutLoading";
import { getRandomIndex } from "@/utils/helpers";

export type CartCheckoutModalProps = ComponentProps<
  ModalProps,
  {
    onPurchaseClick?: () => void;
    onContinueShopingClick?: () => void;
  }
>;

export function CartCheckoutModal({
  isOpen,
  onPurchaseClick,
  onContinueShopingClick,
  ...props
}: CartCheckoutModalProps) {
  const [cart, setCart] = cartState.useState();
  const cartProducts = useCartStateProducts();
  const setUserOrders = userOrdersState.setValue();
  const randomProduct = cartProducts?.length ? cartProducts[getRandomIndex(cartProducts.length)] : undefined;
  const total = cartProducts.reduce((total, { price }) => total + price, 0);
  const { isLoading, startLoading, stopLoading } = useTimeoutLoading();

  const handleRemoveClick = (productId: Product["id"]) => {
    setCart((cart) => ({
      ...cart,
      products: cart.products.filter(({ id: id }) => id !== productId)
    }));
  };

  const handlePurchaseClick = async () => {
    startLoading();
    const res = await api.order.create({ productIds: cart.products.map(({ id }) => id) });
    setCart((cart) => ({ ...cart, products: [] }));
    setUserOrders(res.data);
    ioEvents.recomm.emit();
    onPurchaseClick?.();
    stopLoading();
  };

  let cartBody;
  if (cartProducts.length) {
    cartBody = (
      <ProductList
        variant="3"
        products={cartProducts}
        cardChildren={(productId) => (
          <Button
            variant="ghost"
            flex="0 0 auto"
            onClick={() => handleRemoveClick(productId)}
          >
            <Icon
              name="solid.faTrash"
              w="2.5"
            />
          </Button>
        )}
        withDivider
        mt="6"
        maxH="772px"
      />
    );
  } else {
    cartBody = (
      <Box mt="6">
        <Typography
          as="p"
          fontSize="md"
          lineHeight="6"
          fontWeight="semibold"
        >
          There are no items in your cart.
        </Typography>
        <Button
          variant="solid"
          size="s2.md"
          mt="3"
          onClick={onContinueShopingClick}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  const cartTitle = (
    <Box flex="1 0">
      <Typography
        as="h2"
        fontSize="2xl"
        lineHeight="8"
        fontWeight="semibold"
      >
        {`Cart${cartProducts.length ? ` (${cartProducts.length})` : ""}`}
      </Typography>

      {cartBody}
    </Box>
  );

  const summary = (
    <Box flex="0 0 350px">
      <Typography
        as="h2"
        fontSize="2xl"
        lineHeight="8"
        fontWeight="semibold"
      >
        Summary
      </Typography>
      <Box mt="6">
        <Divider my="4" />
        <Typography
          fontSize="md"
          lineHeight="6"
          fontWeight="semibold"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <span>Total</span>
          <span>{total ? `$${total.toFixed(2)}` : "—"}</span>
        </Typography>
        <Divider my="4" />
      </Box>
      <Button
        variant="solid"
        size="s2.md"
        w="full"
        maxW="full"
        onClick={handlePurchaseClick}
        isDisabled={!total || isLoading}
        mt="10"
      >
        Purchase
      </Button>
    </Box>
  );

  let productsSectionAlso;
  if (isOpen && randomProduct) {
    productsSectionAlso = (
      <ProductSectionRelated
        productId={randomProduct.id}
        mt="3"
        productListProps={{ withRequestCompare: true }}
      />
    );
  }

  return (
    <Modal
      {...props}
      isOpen={isOpen}
      size="s2.md"
    >
      <Flex
        alignItems="flex-start"
        justifyContent="flex-start"
        gap="9"
      >
        {cartTitle}
        {summary}
      </Flex>
      {productsSectionAlso}
    </Modal>
  );
}
