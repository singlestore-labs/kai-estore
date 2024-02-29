import { useCallback, useEffect, useRef } from "react";
import { Box, BoxProps, useDisclosure } from "@chakra-ui/react";

import { ComponentProps, UrlParams } from "@/types/common";

import { useSearchParams } from "@/hooks/useSearchParams";

import { CartCheckoutModal, CartCheckoutModalProps } from "./CartCheckoutModal";
import { CartPreviewModal, CartPreviewModalProps } from "./CartPreviewModal";
import { CartToggler } from "./CartToggler";
import { CartSuccessModal } from "./CartSuccessModal";

export type CartProps = ComponentProps<BoxProps>;

export function Cart({ ...props }: CartProps) {
  const rootRef = useRef(null);
  const previewModalCloseTimeout = useRef<NodeJS.Timeout>();

  const { paramsObject, setParams } = useSearchParams<Pick<UrlParams, "checkout" | "cart">>();

  const {
    onOpen: onPreviewModalOpen,
    onClose: onPreviewModalClose,
    ...previewModal
  } = useDisclosure({
    defaultIsOpen: paramsObject.cart === "1",
    onOpen: () => setParams({ cart: "1" }, { replace: true }),
    onClose: () => setParams({ cart: "" }, { replace: true })
  });

  const {
    onOpen: onCheckoutModalOpen,
    onClose: onCheckoutModalClose,
    ...checkoutModal
  } = useDisclosure({
    defaultIsOpen: paramsObject.checkout === "1",
    onOpen: () => setParams({ checkout: "1", cart: "" }, { replace: true }),
    onClose: () => setParams({ checkout: "" }, { replace: true })
  });

  const successModal = useDisclosure();

  const setPreviewModalCloseTimeout = useCallback(() => {
    previewModalCloseTimeout.current = setTimeout(onPreviewModalClose, 2000);
  }, [onPreviewModalClose]);

  const clearPreviewModalCloseTimeout = useCallback(() => {
    clearTimeout(previewModalCloseTimeout.current);
  }, []);

  useEffect(() => {
    if (paramsObject.cart === "1") {
      onPreviewModalOpen();
      setPreviewModalCloseTimeout();
    } else {
      onPreviewModalClose();
      clearPreviewModalCloseTimeout();
    }

    return () => {
      clearPreviewModalCloseTimeout();
    };
  }, [
    paramsObject.cart,
    onPreviewModalOpen,
    onPreviewModalClose,
    setPreviewModalCloseTimeout,
    clearPreviewModalCloseTimeout
  ]);

  useEffect(() => {
    if (paramsObject.checkout === "1") {
      onCheckoutModalOpen();
    } else {
      onCheckoutModalClose();
    }
  }, [paramsObject.checkout, onCheckoutModalOpen, onCheckoutModalClose]);

  const handleCheckoutClick: CartPreviewModalProps["onCheckoutClick"] = () => {
    onPreviewModalClose();
    onCheckoutModalOpen();
  };

  const handleContinueShopingClick: CartCheckoutModalProps["onContinueShopingClick"] = () => {
    onCheckoutModalClose();
  };

  const handlePurchaseClick: CartCheckoutModalProps["onPurchaseClick"] = () => {
    onCheckoutModalClose();
    successModal.onOpen();
  };

  return (
    <Box
      {...props}
      ref={rootRef}
    >
      <CartToggler onClick={checkoutModal.onToggle} />

      <CartPreviewModal
        portalProps={{ containerRef: rootRef }}
        isOpen={previewModal.isOpen}
        onClose={onPreviewModalClose}
        onCheckoutClick={handleCheckoutClick}
        contentProps={{
          onMouseEnter: clearPreviewModalCloseTimeout,
          onMouseLeave: setPreviewModalCloseTimeout
        }}
      />

      <CartCheckoutModal
        isOpen={checkoutModal.isOpen}
        onClose={onCheckoutModalClose}
        onPurchaseClick={handlePurchaseClick}
        onContinueShopingClick={handleContinueShopingClick}
      />

      <CartSuccessModal
        isOpen={successModal.isOpen}
        onClose={successModal.onClose}
      />
    </Box>
  );
}
