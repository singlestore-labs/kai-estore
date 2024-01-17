import { useCallback } from "react";

import { ComponentProps, UrlParams } from "@/types/common";

import { Modal, ModalProps } from "@/components/common/Modal";

import { ProductDetails } from "./ProductDetails";
import { ProductSectionSales } from "./Section/ProductSectionSales";
import { ProductSectionRelated } from "./Section/ProductSectionRelated";

import { useSearchParams } from "@/hooks/useSearchParams";

export type ProductModalProps = ComponentProps<Omit<ModalProps, "children" | "isOpen" | "onClose">>;

export function ProductModal({ ...props }: ProductModalProps) {
  const { paramsObject, setParams } = useSearchParams<Pick<UrlParams, "product" | "checkout" | "cart">>();
  const productId = paramsObject.product;

  const handleAddToCartClick = useCallback(() => {
    if (paramsObject.checkout === "1") {
      return setParams({ product: "" });
    }

    setParams({ cart: "1", product: "" });
  }, [paramsObject.checkout, setParams]);

  return (
    <Modal
      {...props}
      size="s2.md"
      contentProps={{ minH: "76.875rem" }}
      isOpen={!!productId}
      onClose={() => setParams({ product: "" })}
    >
      <ProductDetails productId={productId} onAddToCartClick={handleAddToCartClick} />
      <ProductSectionSales productId={productId} mt="6" />
      <ProductSectionRelated
        productId={productId}
        productListProps={{
          skeletonDelay: 400,
          initialIsLoading: true,
        }}
        mt="6"
      />
    </Modal>
  );
}
