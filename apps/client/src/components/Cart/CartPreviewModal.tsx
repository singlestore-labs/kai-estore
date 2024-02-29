import { Button } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Modal, ModalProps } from "@/components/common/Modal";
import { Typography } from "@/components/common/Typography";
import { Icon } from "@/components/common/Icon";
import { ProductList } from "@/components/Product/List/ProductList";

import { useCartStateProducts } from "@/state/cart";
import { isInViewport } from "@/utils/helpers";

export type CartPreviewModalProps = ComponentProps<
  ModalProps,
  {
    contentProps?: ModalProps["contentProps"];
    onCheckoutClick?: () => void;
  }
>;

const maxWidth = 350;

export function CartPreviewModal({ contentProps, onCheckoutClick, ...props }: CartPreviewModalProps) {
  const cartProducts = useCartStateProducts();

  const header = global.document?.querySelector(".pageHeader");
  const isHeaderInView = isInViewport(header);
  const topOffset = isHeaderInView ? `${(header?.clientHeight ?? 0) / 16}rem` : 0;
  const togglerBounding = global.document?.querySelector(".cartToggler")?.getBoundingClientRect();
  const leftOffset = (togglerBounding?.right ?? 0) - maxWidth;

  if (!cartProducts.length) {
    return null;
  }

  return (
    <Modal
      {...props}
      header={
        <Typography
          as="h4"
          fontSize="xl"
          lineHeight="7"
          fontWeight="semibold"
          display="flex"
          alignItems="center"
        >
          Added to Cart
          <Icon
            display="inline-block"
            name="solid.faCheckCircle"
            w="6"
            ml="2.5"
          />
        </Typography>
      }
      footer={
        <Button
          variant="solid"
          size="s2.md"
          onClick={onCheckoutClick}
        >
          Checkout
        </Button>
      }
      overlayProps={{ top: topOffset }}
      contentProps={{
        w: "full",
        maxW: maxWidth,
        position: "fixed",
        top: topOffset,
        left: leftOffset,
        transform: "translateX(-100%)",
        mt: "0",
        ...contentProps
      }}
    >
      <ProductList
        variant="3"
        products={cartProducts}
        maxH="467px"
      />
    </Modal>
  );
}
