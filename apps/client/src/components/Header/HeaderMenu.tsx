import { Box, HStack, StackProps } from "@chakra-ui/react";

import { ROUTES } from "@/constants/routes";
import { IS_SINGLE_DB, WITH_DATA_GENERATION } from "@/constants/env";

import { Link } from "@/components/common/Link";
import { ComponentProps } from "@/types/common";
import { PulsatingDot } from "@/components/PulsatingDot";

export type HeaderMenuProps = ComponentProps<StackProps>;

const links = Object.entries({
  [ROUTES.root]: { text: "Catalog" },
  [ROUTES.analytics]: { text: "Analytics", withAttraction: true },
  ...(!IS_SINGLE_DB && WITH_DATA_GENERATION ? { [ROUTES.configure]: { text: "Configure" } } : {})
});

export function HeaderMenu({ ...props }: HeaderMenuProps) {
  return (
    <HStack
      {...props}
      as="nav"
      spacing="2.5"
    >
      {links.map(([href, { text, withAttraction }]) => (
        <Link
          key={text}
          href={href}
          chakra={{ variant: "ghost" }}
        >
          {({ isActive }) => (
            <Box
              as="span"
              position="relative"
            >
              {text}
              {!isActive && withAttraction && (
                <PulsatingDot
                  position="absolute"
                  right={0}
                  top={0}
                  transform="translate(50%, -25%)"
                  fontSize={10}
                />
              )}
            </Box>
          )}
        </Link>
      ))}
    </HStack>
  );
}
