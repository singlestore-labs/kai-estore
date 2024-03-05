import { ComponentProps } from "@/types/common";
import { Box, BoxProps, keyframes } from "@chakra-ui/react";

export type PulsatingDotProps = ComponentProps<BoxProps>;

const pulseAnimation = keyframes({
  "0%": {
    transform: "translate(-50%, -50%) scale(0.1, 0.1)",
    opacity: 0
  },

  "50%": {
    opacity: 1
  },

  "100%": {
    transform: "translate(-50%, -50%) scale(1.2, 1.2)",
    opacity: 0
  }
});

export function PulsatingDot(props: PulsatingDotProps) {
  return (
    <Box
      position="relative"
      w="1em"
      h="1em"
      color="s2.purple.800"
      {...props}
    >
      <Box
        as="span"
        position="absolute"
        top="50%"
        left="50%"
        border="0.25em"
        borderStyle="solid"
        borderColor="currentcolor"
        w="200%"
        h="200%"
        rounded="100%"
        transform="translate(-50%, -50%)"
        animation={`${pulseAnimation} 1s ease-out infinite`}
      />
      <Box
        as="span"
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        background="currentcolor"
        rounded="100%"
      />
    </Box>
  );
}
