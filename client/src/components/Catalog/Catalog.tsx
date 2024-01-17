import { Flex } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { SectionProps, Section } from "@/components/common/Section";

import { CatalogFilters } from "./CatalogFilters";
import { CatalogProducts } from "./CatalogProducts";
import { CatalogSort } from "./CatalogSort";

import { useProductsStateTotal } from "@/state/products";

export type CatalogProps = ComponentProps<SectionProps>;

export function Catalog({ ...props }: CatalogProps) {
  const productsNumber = useProductsStateTotal();

  return (
    <Section
      title={`All products (${productsNumber})`}
      {...props}
      headerChildren={<CatalogSort />}
      headerProps={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: "6",
      }}
    >
      <Flex alignItems="stretch" justifyContent="flex-start" gap="6">
        <CatalogFilters
          flex="0 0 14.75rem"
          overflowX="hidden"
          overflowY="auto"
          display={{ base: "none", md: "block" }}
        />
        <CatalogProducts flex="1" />
      </Flex>
    </Section>
  );
}
