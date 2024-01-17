import { useState, useRef, useCallback, useEffect } from "react";
import { Box, BoxProps } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

export type SkeletonWrapper = ComponentProps<
  BoxProps,
  {
    delay?: number;
    isOpen?: boolean;
    initialIsOpen?: boolean;
  }
>;

export function SkeletonWrapper({
  delay = 0,
  isOpen = false,
  initialIsOpen = false,
  ...props
}: SkeletonWrapper) {
  const [_isOpen, setIsOpen] = useState(initialIsOpen);
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
      transition="visibility 0s, opacity 0.4s ease"
      {...props}
      __css={{
        ...(_isOpen ? { visibility: "visible", opacity: "1" } : { visibility: "hidden", opacity: "0" }),
        ...props.__css,
      }}
    />
  );
}
