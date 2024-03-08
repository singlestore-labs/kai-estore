import { useMemo, useState } from "react";
import { Flex } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Section, SectionProps } from "@/components/common/Section";

import { QuerySection } from "./QuerySection";

import { queriesList } from "@/data";
import { useCDCStatus } from "@/state/cdc";
import { useIsConnectionExist } from "@/state/connection";

export type QueryListSectionProps = ComponentProps<SectionProps>;

export function QueryListSection({ ...props }: QueryListSectionProps) {
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const isConnectionExist = useIsConnectionExist();
  const cdcStatus = useCDCStatus();

  const _queriesList = useMemo(() => {
    const list = queriesList.map((query, i) => (
      <QuerySection
        key={query.title}
        query={query}
        runOnMount
        canRun={i === activeQueryIndex}
        afterRun={() => {
          setActiveQueryIndex((i) => i + 1);
        }}
      />
    ));

    return (
      <Flex
        flexDirection="column"
        rowGap="6"
      >
        {list}
      </Flex>
    );
  }, [activeQueryIndex]);

  return (
    <Section
      key={cdcStatus}
      variant="2"
      title="Other Queries"
      description={`SingleStore Kai™ also allows you to perform search, filter, aggregates, and point-reads/inserts.`}
      {...props}
    >
      {_queriesList}
    </Section>
  );
}
