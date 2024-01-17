import { Box, BoxProps } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { SearchParamsController } from "@/components/common/SearchParamsController";
import { InputCheckboxAccordion } from "@/components/common/InputCheckboxAccordion";

import { useCategoryStateOptions } from "@/state/categories";
import { useTagsStateOptions } from "@/state/tags";
import { serializeUrlParam } from "@/utils/params";
import { useProductPricesStateOptions } from "@/state/productPrices";
import { useProductRatingsStateOptions } from "@/state/productRatings";

export type CatalogFiltersProps = ComponentProps<BoxProps>;

export function CatalogFilters({ ...props }: CatalogFiltersProps) {
  const categoryOptions = useCategoryStateOptions();
  const tagOptions = useTagsStateOptions();
  const productPriceOptions = useProductPricesStateOptions();
  const productRatingOptions = useProductRatingsStateOptions();

  return (
    <Box {...props}>
      <SearchParamsController paramName="category">
        {({ value, onChange }) => (
          <InputCheckboxAccordion
            title="Categories"
            options={categoryOptions}
            value={serializeUrlParam(value)}
            onChange={onChange}
          />
        )}
      </SearchParamsController>

      <SearchParamsController paramName="tag">
        {({ value, onChange }) => (
          <InputCheckboxAccordion
            title="Tags"
            options={tagOptions}
            value={serializeUrlParam(value)}
            onChange={onChange}
          />
        )}
      </SearchParamsController>

      <SearchParamsController paramName="price">
        {({ value, onChange }) => (
          <InputCheckboxAccordion
            title="Shop by Price"
            options={productPriceOptions}
            value={serializeUrlParam(value)}
            onChange={onChange}
          />
        )}
      </SearchParamsController>

      <SearchParamsController paramName="rating">
        {({ value, onChange }) => (
          <InputCheckboxAccordion
            title="Rating"
            options={productRatingOptions}
            value={serializeUrlParam(value)}
            onChange={onChange}
          />
        )}
      </SearchParamsController>
    </Box>
  );
}
