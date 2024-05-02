import { Box, BoxProps, Container, Flex } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { ROUTES } from "@/constants/routes";

import { Logo } from "@/components/Logo";
import { Cart } from "@/components/Cart/Cart";
import { Link } from "@/components/common/Link";

import { HeaderTopBar } from "./HeaderTopBar";
import { HeaderMenu } from "./HeaderMenu";

export type HeaderProps = ComponentProps<BoxProps>;

export function Header(props: HeaderProps) {
  return (
    <Box
      {...props}
      as="header"
      className="pageHeader"
      position="relative"
      w="full"
      maxW="full"
      bg="s2.misc.2"
      zIndex="modal"
    >
      <HeaderTopBar />
      <Box
        bg="white"
        borderTopLeftRadius="15px"
        borderTopRightRadius="15px"
        py="4"
      >
        <Container
          position="relative"
          size="s2.xl"
        >
          <Flex
            flexWrap="wrap"
            alignItems="center"
            justifyContent="space-between"
            rowGap="3"
          >
            <Link
              href={ROUTES.root}
              chakra={{ flex: "1 0 auto", _hover: { textDecoration: "none" } }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Logo
                  display="flex"
                  w="12rem"
                />
                <Box
                  as="span"
                  fontSize="1.6rem"
                  display="flex"
                  flexWrap="nowrap"
                  alignItems="center"
                  gap={1}
                >
                  <Box as="span">Kai™</Box>
                  <Box
                    as="span"
                    fontSize="0.75em"
                  >
                    |
                  </Box>
                  <Box as="span">eStore</Box>
                </Box>
              </Box>
            </Link>
            <HeaderMenu />
            <Flex
              flex="1"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Cart ml="2.5" />
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
