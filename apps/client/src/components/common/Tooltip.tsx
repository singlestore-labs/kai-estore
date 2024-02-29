import { ReactNode } from "react";
import { Box, BoxProps, Tooltip as ChakraTooltip, TooltipProps as ChakraTooltipProps } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Icon, IconProps } from "./Icon";

export type TooltipProps = ComponentProps<
  ChakraTooltipProps,
  | {
      icon: IconProps["name"];
      iconWrapperProps?: Omit<BoxProps, "children">;
      children?: never;
    }
  | {
      icon?: never;
      iconWrapperProps?: never;
      children: ReactNode;
    }
>;

export function Tooltip({ children, icon, iconWrapperProps, ...props }: TooltipProps) {
  let body = children;
  if (icon) {
    body = (
      <Box
        as="span"
        display="inline-flex"
        w="fit-content"
        {...iconWrapperProps}
      >
        <Icon
          name={icon}
          w="4"
        />
      </Box>
    );
  }

  return (
    <ChakraTooltip
      placement="top-end"
      color="white"
      maxW="15rem"
      bg="black"
      hasArrow
      {...props}
    >
      {body}
    </ChakraTooltip>
  );
}
