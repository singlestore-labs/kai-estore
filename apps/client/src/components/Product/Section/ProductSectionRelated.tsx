import { ComponentProps } from "@/types/common";

import { Section, SectionProps } from "@/components/common/Section";
import { Typography } from "@/components/common/Typography";
import { Tooltip } from "@/components/common/Tooltip";

import { ProductListRelated, ProductListRelatedProps } from "../List/ProductListRelated";

export type ProductSectionRelatedProps = ComponentProps<
  SectionProps,
  Pick<ProductListRelatedProps, "productId"> & {
    productListProps?: Omit<ProductListRelatedProps, "productId">;
  }
>;

export function ProductSectionRelated({ productId, productListProps, ...props }: ProductSectionRelatedProps) {
  return (
    <Section
      title={
        <Typography
          as="span"
          display="inline-flex"
          alignItems="center"
        >
          Customers also bought
          <Tooltip
            label="Recommendations are created in real-time based on based on customers who also bought this item"
            icon="solid.faQuestionCircle"
            maxW="16.5rem"
            iconWrapperProps={{ ml: "3" }}
          />
        </Typography>
      }
      {...props}
      containerProps={{ p: "0" }}
    >
      <ProductListRelated
        {...productListProps}
        productId={productId}
      />
    </Section>
  );
}
