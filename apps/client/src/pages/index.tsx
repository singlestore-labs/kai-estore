import { Page } from "@/components/common/Page";
import { ProductSectionRecomm } from "@/components/Product/Section/ProductSectionRecomm";
import { Catalog } from "@/components/Catalog/Catalog";
import { ProductModal } from "@/components/Product/ProductModal";
import { WelcomeModal } from "@/components/WelcomeModal";
import { getDefaultServerSideProps } from "@/utils/next";

export default function Main() {
  return (
    <Page>
      <ProductSectionRecomm />
      <Catalog />
      <ProductModal />
      <WelcomeModal />
    </Page>
  );
}

export const getServerSideProps = getDefaultServerSideProps();
