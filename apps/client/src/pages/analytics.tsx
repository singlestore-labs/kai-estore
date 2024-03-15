import { Flex } from "@chakra-ui/react";

import { Page } from "@/components/common/Page";
import { Section } from "@/components/common/Section";
import { QueryListSection } from "@/components/Query/QueryListSection";
import { ApplicationParameters } from "@/components/ApplicationParameters";

import { getDefaultServerSideProps } from "@/utils/next";
import { ConfigurationSection } from "@/components/Configuration/ConfigurationSection";
import { CDCController } from "@/components/CDCController";

export default function Analytics() {
  return (
    <Page mainProps={{ color: "white", bg: "s2.gray.900" }}>
      <Section
        variant="2"
        title="Data"
        description={`SingleStore Kai™ also allows you to perform vector and text , filter, aggregates, and point-reads/inserts.`}
        mt="6"
      >
        <Flex
          display="grid"
          alignItems="stretch"
          gridTemplateColumns={{
            base: "repeat(auto-fit, minmax(1fr, 1fr))",
            md: "repeat(auto-fit, minmax(16rem, 1fr))"
          }}
          rowGap="6"
          gap="8"
        >
          <ConfigurationSection />
          <ApplicationParameters title="MongoDB® Atlas M30 Data" />
        </Flex>
      </Section>

      <QueryListSection mt="12" />

      <CDCController />
    </Page>
  );
}

export const getServerSideProps = getDefaultServerSideProps();
