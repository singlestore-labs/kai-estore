import { useMemo } from "react";
import { Flex } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Section, SectionProps } from "@/components/common/Section";

import { QuerySection } from "./QuerySection";

import { queriesList } from "@/data";

export type QueryListSectionProps = ComponentProps<SectionProps>;

export function QueryListSection({ ...props }: QueryListSectionProps) {
  const _queriesList = useMemo(() => {
    const list = queriesList.map((query) => <QuerySection key={query.title} query={query} runOnMount />);

    return (
      <Flex flexDirection="column" rowGap="6">
        {list}
      </Flex>
    );
  }, []);

  return (
    <Section
      variant="2"
      title="Other Queries"
      description={`SingleStore Kai™ also allows you to perform search, filter, aggregates, and point-reads/inserts.`}
      {...props}
    >
      {_queriesList}
    </Section>
  );
}
