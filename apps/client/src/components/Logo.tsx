import { Box, BoxProps } from "@chakra-ui/react";

import SingleStoreLogo from "@/assets/SingleStoreLogo.svg";
import SingleStoreLogoSmall from "@/assets/SingleStoreLogoSmall.svg";
import { ComponentProps } from "@/types/common";

export type LogoProps = ComponentProps<
  BoxProps,
  {
    variant?: keyof typeof variantsLogo;
    sourceProps?: BoxProps;
  }
>;

const variantsLogo = {
  "s2": SingleStoreLogo,
  "s2.small": SingleStoreLogoSmall
} as const;

export function Logo({ variant = "s2", sourceProps, color, ...props }: LogoProps) {
  const Logo = variantsLogo[variant];

  return (
    <Box
      as="span"
      {...props}
      color={color}
    >
      <Box
        {...sourceProps}
        as={Logo}
        w="full"
        h="auto"
        __css={
          color
            ? {
                "& [fill]": { fill: "currentcolor" },
                "& [stroke]": { stroke: "currentcolor" }
              }
            : undefined
        }
      />
    </Box>
  );
}
