import {
  Box,
  BoxProps,
  Skeleton as ChakraSkeleton,
  SkeletonProps as ChakraSkeletonProps,
} from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

export type SkeletonProps = ComponentProps<BoxProps, { ratio?: number; skeletonProps?: ChakraSkeletonProps }>;

export function Skeleton({ ratio, skeletonProps, ...props }: SkeletonProps) {
  return (
    <Box
      position="relative"
      overflow="hidden"
      {...props}
      _after={{
        content: "''",
        display: ratio ? "block" : "none",
        pt: `${ratio}%`,
        pointerEvents: "none",
      }}
    >
      <ChakraSkeleton position="absolute" top="0" left="0" w="full" h="full" {...skeletonProps} />
    </Box>
  );
}
