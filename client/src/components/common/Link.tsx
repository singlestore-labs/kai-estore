import { ReactNode, forwardRef } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import { Link as ChakraLink, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import cn from "classnames";

import { ComponentProps } from "@/types/common";
import { Override } from "@/types/helpers";

import { BUTTON_VARIANT_NAMES } from "@/constants/theme";

export type LinkProps = ComponentProps<
  NextLinkProps,
  {
    children?: ReactNode;
    disabled?: boolean;
    chakra?: Override<ChakraLinkProps, { variant?: keyof typeof BUTTON_VARIANT_NAMES }>;
  }
>;

function checkIsExternal(href: LinkProps["href"]): boolean {
  return !(typeof href === "object" ? href.href : href)?.startsWith("/");
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, href, disabled, chakra = {}, ...props }, ref) => {
    const isActive = useRouter().pathname === href;
    const isExternal = checkIsExternal(href);

    let propsExternal: Pick<ChakraLinkProps, "target" | "rel"> = {};
    if (isExternal) {
      propsExternal = {
        target: "_blank",
        rel: "nofollow",
      };
    }

    const link = (
      <ChakraLink
        {...chakra}
        {...propsExternal}
        className={cn(chakra.className, { isActive, isDisabled: disabled })}
      >
        {children}
      </ChakraLink>
    );

    if (disabled) {
      return link;
    }

    return (
      <NextLink {...props} ref={ref} href={href} passHref>
        {link}
      </NextLink>
    );
  },
);

Link.displayName = "Link";
