import { Box, Container, Flex, FlexProps } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Typography } from "@/components/common/Typography";
import { Link } from "@/components/common/Link";

export type HeaderTopBarProps = ComponentProps<FlexProps>;

export function HeaderTopBar({ ...props }: HeaderTopBarProps) {
  return (
    <Box
      {...props}
      color="white"
      py="2.5"
    >
      <Container
        size="s2.xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        rowGap="3"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            as="p"
            fontSize="xs"
            lineHeight="4"
            fontWeight="semibold"
          >
            Unleash the Power of Your Real-Time Analytics with SingleStore
          </Typography>
          <Link
            href="https://www.singlestore.com/cloud-trial/kai"
            chakra={{
              fontSize: "xs",
              fontWeight: "semibold",
              lineHeight: "4",
              border: "1px",
              borderRadius: "full",
              ml: "3",
              py: "1",
              px: "2",
              _hover: { textDecoration: "none" },
              textAlign: "center"
            }}
          >
            Start For Free
          </Link>
        </Flex>
      </Container>
    </Box>
  );
}
