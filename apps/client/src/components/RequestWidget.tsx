import { useEffect, useRef, useState } from "react";
import { Box, BoxProps, Flex, Portal, keyframes } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";
import { requestEvents } from "@/events/request";
import { Typography } from "./common/Typography";
import { Speedometer } from "./common/Speedometer";
import { Logo } from "./Logo";

export type RequestWidgetProps = ComponentProps<BoxProps>;

type State = {
  title?: string;
  value: number;
  displayValue: string;
  isLoading?: boolean;
};

const defaultState: State = {
  title: "",
  value: 0,
  displayValue: "0",
  isLoading: false
};

const animation = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateY(50%)"
  },
  "100%": {
    opacity: 1,
    transform: "translateY(0)"
  }
});

const maxDuration = 1000;

export function RequestWidget({ ...props }: RequestWidgetProps) {
  const [state, setState] = useState<State>(defaultState);
  const prevTimeoutRef = useRef<NodeJS.Timeout | undefined>();
  const isPrevInProgressRef = useRef(false);

  useEffect(() => {
    const remove = requestEvents.onResult(({ title, data, isLoading }) => {
      setState((state) => {
        const _title: State["title"] = title ?? state.title;

        if (isPrevInProgressRef.current && state.title !== "" && state.title !== title) return state;
        isPrevInProgressRef.current = true;

        if (isLoading) {
          clearTimeout(prevTimeoutRef.current);

          prevTimeoutRef.current = setTimeout(() => {
            setState({
              ...state,
              ...defaultState,
              title: _title,
              isLoading: true
            });
          }, 400);

          return { ...state, title: _title };
        }

        if (!isLoading && data) {
          clearTimeout(prevTimeoutRef.current);
          isPrevInProgressRef.current = false;

          return {
            ...state,
            value: 100 / (maxDuration / data[1]),
            displayValue: `${data[2]}${data[3]}`,
            isLoading: false
          };
        }

        return state;
      });
    });

    return () => {
      remove();
    };
  }, []);

  useEffect(() => {
    const remove = requestEvents.onReset(({ title }) => setState({ ...defaultState, title }));
    return () => {
      remove();
    };
  }, []);

  return (
    <Portal>
      <Box
        position="fixed"
        right="8"
        bottom="8"
        w="full"
        maxW="64"
        color="white"
        bg="s2.gray.900"
        borderRadius="md"
        overflow="hidden"
        zIndex="popover"
        visibility={state.title ? "visible" : "hidden"}
        animation={state.title && `${animation} 0.4s ease`}
        {...props}
      >
        <Flex
          alignItems="center"
          px="4"
          py="3"
          borderBottom="1px"
          borderColor="s2.gray.700"
        >
          <Logo
            variant={"s2.small.24"}
            mr="2"
          />
          <Typography
            as="h4"
            fontSize="md"
            lineHeight="6"
            fontWeight="semibold"
          >
            SingleStore
          </Typography>
        </Flex>

        <Box p="6">
          <Flex
            position="relative"
            flexDirection="column"
            alignItems="center"
            w="full"
            maxW="full"
            margin="auto"
            _after={{
              content: "''",
              display: "block",
              pt: "55%",
              pointerEvents: "none"
            }}
          >
            <Box
              position="absolute"
              w="full"
              h="full"
              top="0"
              left="0"
            >
              <Speedometer
                value={state.value}
                displayValue={state.displayValue}
                color="s2.purple.300"
                position="absolute"
                top="50%"
                left="50%"
                w="full"
                isLoading={state.isLoading}
                transform="translate(-50%, -50%)"
                strokeProps={{ strokeWidth: "calc(0.875rem - 2.5%)" }}
              />
            </Box>
          </Flex>

          <Flex
            flexDirection="column"
            rowGap="1"
            mt="1"
          >
            <Typography
              as="h6"
              fontSize="sm"
              lineHeight="5"
              fontWeight="semibold"
              textAlign="center"
            >
              {state.title}
            </Typography>
          </Flex>
        </Box>
      </Box>
    </Portal>
  );
}
