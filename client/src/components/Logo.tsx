import { Box, BoxProps } from "@chakra-ui/react";

import SingleStoreLogo from "@/assets/SingleStoreLogo.svg";
import SingleStoreKaieStoreLogo from "@/assets/SingleStoreKaieStoreLogo.svg";
import SingleStoreLogoSmall from "@/assets/SingleStoreLogoSmall.svg";
import SingleStoreLogoSmall24 from "@/assets/SingleStoreLogoSmall24.svg";
import { ComponentProps } from "@/types/common";

export type LogoProps = ComponentProps<
  BoxProps,
  {
    variant?: keyof typeof variantsLogo;
    sourceProps?: BoxProps;
  }
>;

const variantsLogo = {
  s2: SingleStoreLogo,
  "s2.eStore": SingleStoreKaieStoreLogo,
  "s2.small": SingleStoreLogoSmall,
  "s2.small.24": SingleStoreLogoSmall24,
} as const;

export function Logo({ variant = "s2.eStore", sourceProps, color, ...props }: LogoProps) {
  const Logo = variantsLogo[variant];

  return (
    <Box as="span" {...props} color={color}>
      <Box
        {...sourceProps}
        as={Logo}
        w="full"
        h="auto"
        __css={
          color
            ? {
                "& [fill]": { fill: "currentcolor" },
                "& [stroke]": { stroke: "currentcolor" },
              }
            : undefined
        }
      />
    </Box>
  );
}
