import { useEffect, useRef, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import humanNumber from "human-number";

import { RecommProduct, WithDuration } from "@/types/api";
import { ComponentProps } from "@/types/common";

import { Section, SectionProps } from "@/components/common/Section";

import { api } from "@/api";
import { apiRequestToken } from "@/api/instance";
import { useUserStateHasHistory } from "@/state/user";

import { DbSourceCard, DbSourceCardProps } from "./DbSourceCard";

export type DbSourcesSectionProps = ComponentProps<SectionProps>;

type State = Pick<DbSourceCardProps, "isActive" | "isLoading" | "recomm" | "queryTime">;

const defaultState: State = {
  recomm: {
    value: 0,
    displayValue: "0"
  },
  queryTime: {
    value: 0,
    displayValue: "0"
  },
  isLoading: true
};

function calcData<T extends WithDuration<RecommProduct[]>>(data: T): Pick<State, "queryTime" | "recomm"> {
  const maxDuration = 2000;
  const queryValue = 100 / (maxDuration / data[1]);
  const recommValue = 100 / (maxDuration / (data[1] / data[0].length) / data[0].length);
  const recommPerMs = Math.round(maxDuration / (data[1] / data[0].length));

  return {
    queryTime: {
      value: queryValue,
      displayValue: `${data[2]}${data[3]}`
    },

    recomm: {
      value: recommValue,
      displayValue: humanNumber(recommPerMs)
    }
  };
}

export function DbSourcesSection({ ...props }: DbSourcesSectionProps) {
  const userHasHistory = useUserStateHasHistory();

  const [state, setState] = useState<State>(
    userHasHistory ? defaultState : { ...defaultState, isLoading: false }
  );

  const requestTokenRef = useRef<ReturnType<typeof apiRequestToken>>();

  useEffect(() => {
    if (!userHasHistory) return;

    requestTokenRef.current = apiRequestToken();

    (async () => {
      try {
        setState((state) => ({ ...state, isLoading: true }));
        const response = await api.user.recommProducts({ cancelToken: requestTokenRef.current?.token });
        setState((state) => ({
          ...state,
          ...calcData(response.data),
          isLoading: false
        }));
      } catch (error) {
        setState({ ...defaultState, isLoading: false });
      }
    })();
  }, [userHasHistory]);

  useEffect(
    () => () => {
      requestTokenRef.current?.cancel();
    },
    []
  );

  return (
    <Section
      variant="3.solid"
      {...props}
    >
      <Flex
        display="grid"
        alignItems="flex-end"
        justifyContent="flex-start"
        gridTemplateColumns="repeat(auto-fit, minmax(22rem, 1fr))"
        flexWrap="wrap"
        gap="6"
        rowGap="12"
        minH="13.75rem"
      >
        <Box
          h="auto"
          transition="all 0.4s ease"
          _disabled={{ opacity: "1" }}
        >
          <DbSourceCard
            name="s2"
            title="SingleStore"
            logo="s2.small.24"
            primaryColor="s2.purple.300"
            secondaryColor="s2.purple.800"
            {...state}
            minH="inherit"
            loaderProps={{ delay: 0 }}
            isLoading={state.isLoading}
            isDisabled={!userHasHistory}
          />
        </Box>
      </Flex>
    </Section>
  );
}
