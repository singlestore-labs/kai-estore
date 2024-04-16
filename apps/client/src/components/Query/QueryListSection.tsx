// import { useEffect, useRef, useState } from "react";
import { Flex } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Section, SectionProps } from "@/components/common/Section";

import { QuerySection } from "./QuerySection";

import { queriesList } from "@/data";
import { useCDCStatus } from "@/state/cdc";

export type QueryListSectionProps = ComponentProps<SectionProps>;

export function QueryListSection({ ...props }: QueryListSectionProps) {
  // const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const cdcStatus = useCDCStatus();
  // const prevCDCStatusRef = useRef(cdcStatus);

  // useEffect(() => {
  //   if (cdcStatus !== prevCDCStatusRef.current) {
  //     setActiveQueryIndex(0);
  //     prevCDCStatusRef.current = cdcStatus;
  //   }
  // }, [cdcStatus]);

  return (
    <Section
      key={cdcStatus}
      variant="2"
      title="Other Queries"
      description={`SingleStore Kai™ also allows you to perform search, filter, aggregates, and point-reads/inserts.`}
      {...props}
    >
      <Flex
        flexDirection="column"
        rowGap="6"
      >
        {queriesList.map((query, i) => (
          <QuerySection
            key={query.title}
            query={query}
            runOnMount
            // canRun={i === activeQueryIndex}
            // afterRun={() => {
            //   setActiveQueryIndex((i) => i + 1);
            // }}
          />
        ))}
      </Flex>
    </Section>
  );
}
