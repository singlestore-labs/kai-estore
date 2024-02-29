import { Flex } from "@chakra-ui/react";

import { Page } from "@/components/common/Page";
import { Section } from "@/components/common/Section";
import { QueryListSection } from "@/components/Query/QueryListSection";
import { ApplicationParameters } from "@/components/ApplicationParameters";

import { getDefaultServerSideProps } from "@/utils/next";

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
          alignItems="stretch"
          gap="12"
          rowGap="6"
          flexWrap="wrap"
        >
          <ApplicationParameters
            title="SingleStore Parameters"
            flex="1 0 24rem"
            connection="config"
          />
          <ApplicationParameters
            title="MongoDB® Atlas Parameters"
            flex="1 0 24rem"
          />
        </Flex>
      </Section>

      <QueryListSection mt="12" />
    </Page>
  );
}

export const getServerSideProps = getDefaultServerSideProps();
