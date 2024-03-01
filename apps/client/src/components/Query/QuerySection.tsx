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
import { Loader } from "@/components/common/Loader";

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
  {
    query: Query;
    runOnMount?: boolean;
    canRun?: boolean;
    afterRun?: () => void;
  }
>;

type State = {
  title: string;
  value?: number;
  displayValue: string;
  color?: string;
  titleColor?: string;
  unit?: string;
  data?: any;
  isLoading: boolean;
};

const defaultState: State = {
  title: "Connection",
  value: undefined,
  displayValue: "0",
  data: undefined,
  isLoading: false
};

const defaultConnectionStates: Record<string, State> = {
  s2: { ...defaultState, title: "SingleStore", color: "s2.purple.800", titleColor: "currentColor" },
  mongo: { ...defaultState, title: "MongoDB® Atlas", color: "s2.gray.500" }
};

const connectionKeys = Object.keys(defaultConnectionStates);

export function QuerySection({
  query,
  runOnMount = true,
  canRun = false,
  afterRun,
  ...props
}: QuerySectionProps) {
  const [state, setState] = useState<Record<string, State>>(defaultConnectionStates);
  const [paramsState, setParamsState] = useState({ values: {}, isValid: false });
  const [codeBlock, setCodeBlock] = useState("");
  const stateEntires = Object.entries(state);

  const formId = useId();
  const statCardSubtitle = "Query Time";
  const hasParams = !!Object.keys(query.params?.fields ?? {}).length;
  const isLoading = stateEntires.some(([, { isLoading }]) => isLoading);
  const isRunButtonDisabled = isLoading || (hasParams && !paramsState.isValid);
  const topOneProductItemId = useTopOneProductStateItemdId();

  const requestTokenRef = useRef<Record<string, ReturnType<typeof apiRequestToken>>>();

  const runQueryRef = useRef(async (topOneProductItemId?: string, params?: typeof paramsState.values) => {
    let timeouts: Record<string, NodeJS.Timeout | undefined> = {};

    await Promise.all(
      connectionKeys.map(async (key) => {
        timeouts[key] = setTimeout(
          () => setState((state) => ({ ...state, [key]: { ...state[key], isLoading: true } })),
          800
        );

        requestTokenRef.current = { ...requestTokenRef.current, [key]: apiRequestToken() };

        const [data, ms, value, unit] = (
          await query.request(
            { id: topOneProductItemId, ...params, connection: key === "s2" ? "config" : undefined },
            { cancelToken: requestTokenRef.current?.[key].token }
          )
        ).data;

        setState((state) => ({
          ...state,
          [key]: {
            ...state[key],
            value: 100 / (2000 / ms),
            displayValue: `${value}${unit}`,
            data,
            isLoading: false
          }
        }));

        clearTimeout(timeouts[key]);
      })
    );

    timeouts = {};
    afterRun?.();
  });

  const handleParamsChange = useCallback<Defined<QueryParamsProps["onChange"]>>((values, isValid) => {
    setParamsState({ values, isValid });
  }, []);

  const handleRunClick = useCallback(
    () => runQueryRef.current(topOneProductItemId, paramsState.values),
    [topOneProductItemId, paramsState.values]
  );

  useEffect(() => {
    if (runOnMount && canRun && topOneProductItemId) {
      handleRunClick();
    }
  }, [runOnMount, canRun, topOneProductItemId, handleRunClick]);

  useEffect(
    () => () => {
      connectionKeys.forEach((key) => requestTokenRef.current?.[key].cancel());
    },
    []
  );

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

  let tooltip;
  if (query.description) {
    tooltip = (
      <Tooltip
        label={query.description}
        icon="solid.faQuestionCircle"
        iconWrapperProps={{ ml: "3" }}
      />
    );
  }

  let _title;
  if (query.title) {
    _title = (
      <Typography
        as="span"
        display="inline-flex"
        alignItems="center"
      >
        {query.title}
        {tooltip}
      </Typography>
    );
  }

  return (
    <Section
      variant="3"
      {...props}
      title={_title ?? tooltip}
    >
      <Flex
        w="full"
        alignItems="flex-start"
        justifyContent="flex-end"
        flexWrap="wrap"
        gap="12"
        rowGap="6"
      >
        {hasParams && (
          <QueryParams
            flex="1"
            w="auto"
            fields={query.params?.fields}
            validationSchema={query.params?.validationSchema}
            formProps={{ id: formId }}
            isLoading={isLoading}
            onChange={handleParamsChange}
          />
        )}

        <Box
          flex={{ base: "1 0 100%", md: "1 0 50%" }}
          maxW={{ base: "full", md: "50%" }}
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(16rem, 1fr))"
          gap="6"
          rowGap="6"
          flexWrap="wrap"
        >
          {Object.entries(state).map(([key, state]) => (
            <StatCard
              key={key}
              title={state.title}
              subtitle={statCardSubtitle}
              speedometers={[{ ...pick(state, ["value", "displayValue", "unit"]) }]}
              primaryColor={state.color}
              titleColor={state.titleColor}
              isDisabled={!state.value}
              isLoading={state.isLoading}
            />
          ))}
        </Box>
      </Flex>

      <Box
        mt="6"
        display="flex"
        alignItems="stretch"
        gap="6"
      >
        {stateEntires.map(([key, state]) => {
          let results = (
            <Box
              h="full"
              backgroundColor="s2.gray.900"
            />
          );

          if (state.data) {
            results = (
              <Textarea
                variant="outline.code"
                h="full"
                size="s2.md"
                border="none"
                value={JSON.stringify(state.data, null, 2)}
                readOnly
              />
            );
          }

          if (state.isLoading) {
            results = (
              <Loader
                isOpen
                color={state.color}
                isDark
              />
            );
          }

          return (
            <Box
              key={key}
              flex="1 0 calc(50% - 1.5rem)"
            >
              <Typography
                as="h4"
                fontSize="sm"
                lineHeight="5"
                fontWeight="semibold"
              >
                {`${state.title} Result`}
              </Typography>
              <Box
                position="relative"
                h="xs"
                border="2px"
                borderColor={isLoading ? "transparent" : state.data ? state.color : "s2.gray.800"}
                borderRadius="lg"
                transition="0.4s ease"
                overflow="hidden"
                mt="2"
              >
                {results}
              </Box>
            </Box>
          );
        })}
      </Box>

      {codeBlock && (
        <Box mt="6">
          <Typography
            as="h4"
            fontSize="sm"
            lineHeight="5"
            fontWeight="semibold"
          >
            Query
          </Typography>
          <Textarea
            variant="outline.code"
            size="s2.md"
            h="xs"
            value={codeBlock}
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
