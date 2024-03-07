import { Box, BoxProps, Container, Flex, forwardRef } from "@chakra-ui/react";

import { APP_DESCRIPTION } from "@/constants/common";

import { Typography } from "@/components/common/Typography";
import { Link } from "@/components/common/Link";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/common/Icon";
import { ComponentProps } from "@/types/common";

export type FooterProps = ComponentProps<BoxProps>;

export const Footer = forwardRef<FooterProps, "footer">(({ _before, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      as="footer"
      position="relative"
      w="full"
      color="white"
      bg="s2.misc.2"
      py="9"
      zIndex="0"
      _before={{
        content: "''",
        position: "absolute",
        display: "block",
        top: "-30px",
        left: 0,
        w: "full",
        h: "30px",
        bg: "inherit",
        ..._before
      }}
      {...props}
    >
      <Container
        size="s2.xl"
        display="flex"
        justifyContent="flex-start"
      >
        <Flex
          flexDirection="column"
          alignItems="flex-start"
          flex="1"
          justifyContent="space-between"
          maxW="600px"
        >
          <Typography
            as="p"
            fontSize="sm"
            fontWeight="semibold"
          >
            {APP_DESCRIPTION}
          </Typography>
          <Link
            href="https://www.singlestore.com/"
            chakra={{ mt: "6" }}
          >
            <Logo variant="s2" />
          </Link>
        </Flex>

        <Flex
          flexDirection="column"
          alignItems="flex-end"
          justifyContent="space-between"
          flex="1"
        >
          <Flex gap="1.5">
            <Link
              href="https://github.com/memsql"
              chakra={{ variant: "solid" }}
            >
              <Icon name="social.github" />
            </Link>
            <Link
              href="https://twitter.com/singlestoredb"
              chakra={{ variant: "solid" }}
            >
              <Icon name="social.twitter" />
            </Link>
            <Link
              href="https://www.linkedin.com/company/singlestore/mycompany"
              chakra={{ variant: "solid" }}
            >
              <Icon name="social.linkedin" />
            </Link>
          </Flex>
          <Link
            href="https://www.singlestore.com/"
            chakra={{ fontSize: "sm", fontWeight: "semibold" }}
          >
            singlestore.com
          </Link>
        </Flex>
      </Container>
    </Box>
  );
});
