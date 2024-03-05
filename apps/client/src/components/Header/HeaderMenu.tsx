import { HStack, StackProps } from "@chakra-ui/react";

import { ROUTES } from "@/constants/routes";
import { IS_SINGLE_DB, WITH_DATA_GENERATION } from "@/constants/env";

import { Link } from "@/components/common/Link";
import { ComponentProps } from "@/types/common";

export type HeaderMenuProps = ComponentProps<StackProps>;

const links = Object.entries({
  [ROUTES.root]: "Catalog",
  [ROUTES.analytics]: "Analytics",
  ...(!IS_SINGLE_DB && WITH_DATA_GENERATION ? { [ROUTES.configure]: "Configure" } : {})
});

export function HeaderMenu({ ...props }: HeaderMenuProps) {
  return (
    <HStack
      {...props}
      as="nav"
      spacing="2.5"
    >
      {links.map(([href, text]) => (
        <Link
          key={text}
          href={href}
          chakra={{ variant: "ghost" }}
        >
          {text}
        </Link>
      ))}
    </HStack>
  );
}
