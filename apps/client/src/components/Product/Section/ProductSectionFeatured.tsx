import { ComponentProps } from "@/types/common";

import { Section, SectionProps } from "@/components/common/Section";
import { Typography } from "@/components/common/Typography";
import { Tooltip } from "@/components/common/Tooltip";

import { ProductListRecomm } from "../List/ProductListRecomm";
import { ProductListTrending } from "../List/ProductListTrending";

export type ProductSectionRecommProps = ComponentProps<SectionProps>;

export function ProductSectionFeatured({ ...props }: ProductSectionRecommProps) {
  const isTrending = true;

  const title = isTrending ? "Trending Now" : "Recommended For You";
  const tooltipText = isTrending
    ? "Trending now is a collection of best selling items calculated in real-time"
    : "Recommendations are created in real-time based on your purchase history and star rating";

  return (
    <Section
      title={
        <Typography
          as="span"
          display="inline-flex"
          alignItems="center"
        >
          {title}
          <Tooltip
            label={tooltipText}
            icon="solid.faQuestionCircle"
            iconWrapperProps={{ ml: "3" }}
          />
        </Typography>
      }
      // bg="s2.gray.100"
      pb="6"
      {...props}
    >
      {isTrending ? <ProductListTrending /> : <ProductListRecomm />}
    </Section>
  );
}
