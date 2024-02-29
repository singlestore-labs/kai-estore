import { useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { Box, BoxProps, Portal, keyframes } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";
import SingleStoreSpinner from "@/assets/SingleStoreSpinner.svg";
import { Typography } from "@/components/common/Typography";

export type ConnectLoaderProps = ComponentProps<BoxProps> & {
  delay?: number;
  title?: ReactNode;
  message?: ReactNode;
  isOpen?: boolean;
  variant?: "light" | "dark";
};

const circleAnimation = keyframes({
  "0%": {
    transform: "rotate(-90deg)",
  },
  "100%": {
    transform: "rotate(270deg)",
  },
});

export function ConnectLoader({
  delay = 300,
  title,
  message,
  variant = "light",
  isOpen = false,
  ...props
}: ConnectLoaderProps) {
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
    <Portal>
      <Box
        position="fixed"
        top="0"
        left="0"
        w="full"
        h="full"
        color="s2.purple.800"
        bg={variant === "light" ? "white" : "#1b1a21"}
        transition="visibility 0s, opacity 0.4s ease"
        zIndex="2000"
        {...props}
        __css={{
          ...(_isOpen ? { visibility: "visible", opacity: "1" } : { visibility: "hidden", opacity: "0" }),
          ...props.__css,
        }}
        as="span"
      >
        <Box
          as="span"
          position="absolute"
          top="50%"
          left="50%"
          h="auto"
          transform="translate(-50%, -50%)"
          zIndex="1"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            as={SingleStoreSpinner}
            w="clamp(64px, 6.11vw, 96px)"
            h="auto"
            animation={`${circleAnimation} 1s infinite linear`}
          />

          <Typography
            as="p"
            fontSize="xl"
            lineHeight="7"
            color={variant === "light" ? "black" : "white"}
            fontWeight="semibold"
            textAlign="center"
            mt="8"
          >
            {title}
          </Typography>
          {message && (
            <Typography as="p" color={variant === "light" ? "black" : "white"} textAlign="center" mt="4">
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </Portal>
  );
}
