import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Box, Button, Flex, Textarea } from "@chakra-ui/react";
import pick from "lodash.pick";
import { AxiosRequestConfig } from "axios";

import { ComponentProps } from "@/types/common";
import { Defined } from "@/types/helpers";

import { Section, SectionProps } from "@/components/common/Section";
import { Tooltip, TooltipProps } from "@/components/common/Tooltip";
import { Typography } from "@/components/common/Typography";
import { StatCard } from "@/components/common/StatCard";

import { apiRequestToken } from "@/api/instance";
import { useTopOneProductStateItemdId } from "@/state/topOneProduct";

import { QueryParams, QueryParamsProps } from "./QueryParams";

type QueryRequest = (params: Record<string, any>, config?: AxiosRequestConfig) => any;

export type Query<T extends QueryRequest = QueryRequest> = {
  title?: string;
  description?: TooltipProps["label"];
  codeBlock?: string;
  params?: {
    fields?: QueryParamsProps["fields"];
    validationSchema?: QueryParamsProps["validationSchema"];
  };
  request: T;
};

export type QuerySectionProps = ComponentProps<
  Omit<SectionProps, "children">,
  { query: Query; runOnMount?: boolean }
>;

type State = {
  title: string;
  value: number;
  displayValue: string;
  color?: string;
  unit?: string;
  data?: any;
  isLoading: boolean;
};

const defaultState: State = {
  title: "SingleStore",
  value: 0,
  displayValue: "0",
  data: [],
  isLoading: false,
};

export function QuerySection({ query, runOnMount = true, ...props }: QuerySectionProps) {
  const [state, setState] = useState<State>(defaultState);
  const [paramsState, setParamsState] = useState({ values: {}, isValid: false });
  const [codeBlock, setCodeBlock] = useState("");

  const formId = useId();
  const statCardSubtitle = "Query Time";
  const hasParams = !!Object.keys(query.params?.fields ?? {}).length;
  const isRunButtonDisabled = state.isLoading || (hasParams && !paramsState.isValid);
  const topOneProductItemId = useTopOneProductStateItemdId();

  const requestTokenRef = useRef<ReturnType<typeof apiRequestToken>>();

  const runQueryRef = useRef(async (params?: typeof paramsState.values) => {
    let timeout: NodeJS.Timeout | undefined = undefined;

    try {
      requestTokenRef.current = apiRequestToken();
      timeout = setTimeout(() => setState((state) => ({ ...state, isLoading: true })), 800);

      const [data, ms, value, unit] = (
        await query.request(
          { id: topOneProductItemId, ...params },
          { cancelToken: requestTokenRef.current?.token },
        )
      ).data;

      setState((state) => {
        return {
          ...state,
          value: 100 / (2000 / ms),
          displayValue: `${value}${unit}`,
          data,
          isLoading: false,
        };
      });
    } catch (error) {
      setState(defaultState);
    } finally {
      clearTimeout(timeout);
      timeout = undefined;
    }
  });

  useEffect(
    () => () => {
      requestTokenRef.current?.cancel();
    },
    [],
  );

  const handleParamsChange = useCallback<Defined<QueryParamsProps["onChange"]>>((values, isValid) => {
    setParamsState({ values, isValid });
  }, []);

  const handleRunClick = () => runQueryRef.current(paramsState.values);

  useEffect(() => {
    if (runOnMount) {
      runQueryRef.current();
    }
  }, [runOnMount]);

  let tooltip;
  if (query.description) {
    tooltip = (
      <Tooltip label={query.description} icon="solid.faQuestionCircle" iconWrapperProps={{ ml: "3" }} />
    );
  }

  let _title;
  if (query.title) {
    _title = (
      <Typography as="span" display="inline-flex" alignItems="center">
        {query.title}
        {tooltip}
      </Typography>
    );
  }

  useEffect(() => {
    (async () => {
      try {
        if (!query.codeBlock) return;
        const res = await fetch(query.codeBlock);
        setCodeBlock(await res.text());
      } catch (error) {
        setCodeBlock("");
      }
    })();
  }, [query.codeBlock]);

  return (
    <Section variant="3" {...props} title={_title ?? tooltip}>
      <Flex w="full" alignItems="flex-start" justifyContent="flex-end" flexWrap="wrap" gap="12" rowGap="6">
        {hasParams && (
          <QueryParams
            flex="1"
            w="auto"
            fields={query.params?.fields}
            validationSchema={query.params?.validationSchema}
            formProps={{ id: formId }}
            isLoading={state.isLoading}
            onChange={handleParamsChange}
          />
        )}

        <Box
          flex={{ base: "1 0 100%", md: "1 0 23.75rem" }}
          maxW={{ base: "full", md: "23.75rem" }}
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(16rem, 1fr))"
          gap="6"
          rowGap="6"
          flexWrap="wrap"
        >
          <StatCard
            subtitle={statCardSubtitle}
            speedometers={[{ ...pick(state, ["value", "displayValue", "unit"]) }]}
            primaryColor={state.color}
            isDisabled={!state.value}
            isLoading={state.isLoading}
          />
        </Box>
      </Flex>

      {codeBlock && (
        <Textarea variant="outline.code" size="s2.md" rows={16} value={codeBlock} readOnly mt="6" />
      )}

      {(Array.isArray(state.data) ? !!state.data.length : state.data) && (
        <Box mt="6">
          <Typography as="h4" fontSize="sm" lineHeight="5" fontWeight="semibold">
            Result
          </Typography>
          <Textarea
            variant="outline.code"
            size="s2.md"
            rows={16}
            value={JSON.stringify(state.data, null, 2)}
            readOnly
            mt="2"
          />
        </Box>
      )}

      <Button
        type="submit"
        variant="solid"
        size="s2.md"
        mt="6"
        ml="auto"
        form={formId}
        isDisabled={isRunButtonDisabled}
        onClick={handleRunClick}
      >
        Run query
      </Button>
    </Section>
  );
}
