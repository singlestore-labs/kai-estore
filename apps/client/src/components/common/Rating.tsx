import { Flex, FlexProps, HStack } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Icon } from "./Icon";
import { Typography } from "./Typography";

export type RatingProps = ComponentProps<FlexProps, { value?: number }>;

export function Rating({ value = 3, ...props }: RatingProps) {
  if (!value) return null;

  return (
    <Flex
      alignItems="center"
      justifyContent="flex-start"
      {...props}
    >
      <HStack
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        spacing="0.5"
      >
        {Array.from({ length: value > 5 ? 5 : value }).map((_, i) => (
          <Icon
            key={i}
            name="solid.faStar"
            w="4"
            color="s2.purple.800"
          />
        ))}
      </HStack>
      <Typography
        as="p"
        fontSize="sm"
        fontWeight="semibold"
        ml="2"
      >
        {value.toFixed(1)}
      </Typography>
    </Flex>
  );
}
