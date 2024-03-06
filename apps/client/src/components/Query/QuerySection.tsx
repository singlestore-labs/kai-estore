import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Box, Button, Flex, Textarea } from "@chakra-ui/react";
import pick from "lodash.pick";
import axios, { AxiosRequestConfig } from "axios";

import { ComponentProps } from "@/types/common";
import { Defined } from "@/types/helpers";

import { Section, SectionProps } from "@/components/common/Section";
import { Tooltip, TooltipProps } from "@/components/common/Tooltip";
import { Typography } from "@/components/common/Typography";
import { StatCard } from "@/components/common/StatCard";

import { apiRequestToken } from "@/api/instance";

import { QueryParams, QueryParamsProps } from "./QueryParams";
import { Loader } from "@/components/common/Loader";
import { SERVER_URL } from "@/constants/env";
import { connectionState } from "@/state/connection";

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
  value: number;
  displayValue: string;
  color?: string;
  titleColor?: string;
  ms: number;
  x: number;
  unit?: string;
  data?: any;
  isFaster?: boolean;
  isLoading: boolean;
};

const defaultState: State = {
  title: "Connection",
  value: 0,
  displayValue: "0ms",
  ms: 0,
  x: 0,
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
  const [_runOnMount, setRunOnMount] = useState(runOnMount);
  const connestionStateValue = connectionState.useValue();
  const prevIsConnectionExist = useRef(connestionStateValue.isExist);
  const stateEntires = Object.entries(state).filter(([key]) => {
    if (key === "s2" && !connestionStateValue.isExist) return false;
    return true;
  });
  const formId = useId();
  const statCardSubtitle = "Query Time";
  const hasParams = !!Object.keys(query.params?.fields ?? {}).length;
  const isLoading = stateEntires.some(([, { isLoading }]) => isLoading);
  const isRunButtonDisabled = isLoading || (hasParams && !paramsState.isValid);
  const requestTokenRef = useRef<Record<string, ReturnType<typeof apiRequestToken>>>();

  const runQueryRef = useRef(async (isConnectionExist?: boolean, params?: typeof paramsState.values) => {
    let timeouts: Record<string, NodeJS.Timeout | undefined> = {};

    await Promise.all(
      connectionKeys.map(async (key) => {
        if (key === "s2" && !isConnectionExist) return;
        timeouts[key] = setTimeout(
          () => setState((state) => ({ ...state, [key]: { ...state[key], isLoading: true } })),
          800
        );

        requestTokenRef.current = { ...requestTokenRef.current, [key]: apiRequestToken() };

        const [data, ms = 0, value = 0, unit = "ms"] = (
          await query.request(
            { ...params, connection: key === "s2" ? "config" : undefined },
            { cancelToken: requestTokenRef.current?.[key].token }
          )
        ).data;

        setState((state) => ({
          ...state,
          [key]: {
            ...state[key],
            ms,
            data,
            displayValue: `${value}${unit}`,
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

  const handleRunClick = useCallback(() => {
    runQueryRef.current(connestionStateValue.isExist, paramsState.values);
    setRunOnMount(false);
  }, [connestionStateValue.isExist, paramsState.values]);

  useEffect(() => {
    if ((_runOnMount && canRun) || connestionStateValue.isExist !== prevIsConnectionExist.current) {
      handleRunClick();
      prevIsConnectionExist.current = connestionStateValue.isExist;
    }
  }, [_runOnMount, canRun, handleRunClick, connestionStateValue.isExist]);

  useEffect(
    () => () => {
      connectionKeys.forEach((key) => requestTokenRef.current?.[key]?.cancel());
    },
    []
  );

  useEffect(() => {
    (async () => {
      try {
        if (!query.codeBlock) return;
        const res = await axios.get(`${SERVER_URL}/code-blocks/${query.codeBlock}.txt`);
        setCodeBlock(res.data);
      } catch (error) {
        setCodeBlock("");
      }
    })();
  }, [query.codeBlock]);

  useEffect(() => {
    if (isLoading) return;
    setState((state) => {
      let maxMs = -Infinity;

      Object.values(state).forEach((item) => {
        if (item.ms > maxMs) {
          maxMs = item.ms;
        }
      });

      const [s2, mongo] = [state.s2.ms, state.mongo.ms].map((i) => {
        const ratio = maxMs / i;
        return {
          value: 100 / (maxMs / i),
          x: ratio < 2 ? 0 : Math.round(ratio),
          isFaster: i < maxMs
        };
      });

      return { ...state, s2: { ...state.s2, ...s2 }, mongo: { ...state.mongo, ...mongo } };
    });
  }, [isLoading]);

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
        display="grid"
        gridTemplateColumns={{
          base: "repeat(auto-fit, minmax(1fr, 1fr))",
          md: "repeat(auto-fit, minmax(16rem, 1fr))"
        }}
        gap="6"
      >
        {hasParams && (
          <QueryParams
            fields={query.params?.fields}
            validationSchema={query.params?.validationSchema}
            formProps={{ id: formId }}
            isLoading={isLoading}
            onChange={handleParamsChange}
          />
        )}

        <Box
          display="grid"
          gridTemplateColumns={{
            base: "repeat(auto-fit, minmax(1fr, 1fr))",
            md: "repeat(auto-fit, minmax(16rem, 1fr))"
          }}
          gap="6"
          flexWrap="wrap"
        >
          {stateEntires.map(([key, state]) => (
            <StatCard
              key={key}
              title={state.title}
              subtitle={statCardSubtitle}
              speedometers={[
                {
                  ...pick(state, ["value", "displayValue", "unit"]),
                  title: state.isFaster && state.x ? `x${state.x}` : undefined
                }
              ]}
              primaryColor={state.color}
              titleColor={state.titleColor}
              isDisabled={state.displayValue === "0ms"}
              isLoading={state.isLoading}
            />
          ))}
        </Box>
      </Flex>

      <Box
        mt="6"
        display="grid"
        gridTemplateColumns={{
          base: "repeat(auto-fit, minmax(1fr, 1fr))",
          md: "repeat(auto-fit, minmax(24rem, 1fr))"
        }}
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
            <Box key={key}>
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
