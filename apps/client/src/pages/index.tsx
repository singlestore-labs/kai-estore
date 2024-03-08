import { Page } from "@/components/common/Page";
import { ProductSectionRecomm } from "@/components/Product/Section/ProductSectionRecomm";
import { Catalog } from "@/components/Catalog/Catalog";
import { ProductModal } from "@/components/Product/ProductModal";
import { WelcomeModal } from "@/components/WelcomeModal";
import { getDefaultServerSideProps } from "@/utils/next";
import { ActiveClusterWidget } from "@/components/ActiveClusterWidget";
import { MutableRefObject, useRef } from "react";

export default function Main() {
  const footerRef = useRef<MutableRefObject<any>>();

  return (
    <Page footerRef={footerRef}>
      <ProductSectionRecomm />
      <Catalog />
      <ProductModal />
      <WelcomeModal />
      <ActiveClusterWidget
        hideOnRef={footerRef}
        zIndex="1"
      />
    </Page>
  );
}

export const getServerSideProps = getDefaultServerSideProps();
