import { ReactNode } from "react";
import { Box, BoxProps, Flex } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Icon, IconProps } from "./Icon";
import { Typography } from "./Typography";

export type ToastProps = ComponentProps<
  BoxProps,
  {
    title?: ReactNode;
    text?: ReactNode;
    icon?: IconProps["name"];
  }
>;

export function Toast({ title, text, icon = "solid.faInfoCircle", ...props }: ToastProps) {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      color="gray.700"
      maxW="434px"
      bg="s2.purple.200"
      py="3"
      pr="4"
      pl="1.125rem"
      borderTop="4px solid"
      borderColor="s2.purple.800"
      {...props}
    >
      <Icon
        name={icon}
        flex="0 0 auto"
        color="s2.purple.800"
        w="6"
        mr="3"
      />

      <Box>
        <Typography
          as="h4"
          fontSize="md"
          lineHeight="6"
          fontWeight="bold"
        >
          {title}
        </Typography>
        <Typography
          as="p"
          fontSize="md"
          lineHeight="6"
          fontWeight="normal"
        >
          {text}
        </Typography>
      </Box>
    </Flex>
  );
}
