import { useCallback, useEffect, useRef, useState } from "react";
import { Box, BoxProps, keyframes } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

export type LoaderProps = ComponentProps<
  BoxProps,
  {
    delay?: number;
    isOpen?: boolean;
    isDark?: boolean;
  }
>;

const defaultStrokeDashArray = 125;

const strokeAnimation = keyframes({
  "0%": {
    strokeDashoffset: defaultStrokeDashArray,
  },

  "50%": {
    strokeDashoffset: 0,
  },

  "100%": {
    strokeDashoffset: -defaultStrokeDashArray,
  },
});

const circleAnimation = keyframes({
  "0%": {
    transform: "rotate(-90deg)",
  },
  "100%": {
    transform: "rotate(270deg)",
  },
});

export function Loader({ delay = 300, isOpen = false, isDark = false, ...props }: LoaderProps) {
  const [_isOpen, setIsOpen] = useState(isOpen);
  const prevTimeoutRef = useRef<NodeJS.Timeout>();

  const clear = useCallback(() => {
    clearTimeout(prevTimeoutRef.current);
    prevTimeoutRef.current = undefined;
  }, []);

  useEffect(() => {
    if (isOpen) {
      prevTimeoutRef.current = setTimeout(() => setIsOpen(true), delay);
    } else {
      setIsOpen(false);
      clear();
    }

    return () => {
      clear();
    };
  }, [isOpen, delay, clear]);

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      w="full"
      h="full"
      borderRadius="inherit"
      color="s2.indigo.600"
      transition="visibility 0s, opacity 0.4s ease"
      zIndex="2"
      {...props}
      __css={{
        ...(_isOpen ? { visibility: "visible", opacity: "1" } : { visibility: "hidden", opacity: "0" }),
        ...props.__css,
      }}
      as="span"
    >
      <Box
        as="span"
        display="block"
        position="absolute"
        top="0"
        left="0"
        w="full"
        h="full"
        bg={isDark ? "s2.gray.900" : "whiteAlpha.500"}
      />

      <Box
        as="span"
        position="absolute"
        top="50%"
        left="50%"
        h="auto"
        w="12.77%"
        maxW="16"
        transform="translate(-50%, -50%)"
        zIndex="1"
        _after={{ content: "''", display: "block", w: "full", pt: "100%" }}
      >
        <Circle
          color="currentcolor"
          animation={`${circleAnimation} 3s infinite linear`}
          strokeProps={{
            animation: `${strokeAnimation} 2s infinite ease`,
            strokeDasharray: defaultStrokeDashArray,
          }}
          zIndex="1"
        />
        <Circle color={isDark ? "s2.gray.800" : "s2.gray.300"} />
      </Box>
    </Box>
  );
}

function Circle({
  strokeProps,
  ...props
}: BoxProps & { strokeProps?: BoxProps & { strokeDasharray?: string | number } }) {
  return (
    <Box
      as="svg"
      position="absolute"
      top="0"
      left="0"
      w="full"
      h="full"
      color="s2.gray.800"
      transition="all 0.2s ease"
      transform="rotate(-90deg)"
      {...props}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Box
        as="circle"
        cx="24"
        cy="24"
        r="20"
        stroke="currentcolor"
        strokeWidth="8"
        strokeLinecap="round"
        transition="inherit"
        {...strokeProps}
      />
    </Box>
  );
}
