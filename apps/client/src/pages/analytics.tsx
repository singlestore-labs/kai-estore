import { Flex } from "@chakra-ui/react";

import { Page } from "@/components/common/Page";
import { Section } from "@/components/common/Section";
import { QueryListSection } from "@/components/Query/QueryListSection";
import { ApplicationParameters } from "@/components/ApplicationParameters";

import { getDefaultServerSideProps } from "@/utils/next";
import { ConfigurationSection } from "@/components/Configuration/ConfigurationSection";

export default function Analytics() {
  return (
    <Page mainProps={{ color: "white", bg: "s2.gray.900" }}>
      <Section
        variant="2"
        title="Data"
        description={`SingleStore Kai™ allows you to perform large scale aggregate queries in milliseconds empowering you to deliver real-time data to your customers.`}
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
          <ApplicationParameters title="MongoDB® Atlas M30 Parameters" />
        </Flex>
      </Section>

      <QueryListSection mt="12" />
    </Page>
  );
}

export const getServerSideProps = getDefaultServerSideProps();
