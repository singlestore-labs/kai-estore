import { Box, BoxProps } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Header, HeaderProps } from "@/components/Header/Header";
import { Footer, FooterProps } from "@/components/Footer";

import { Head, HeadProps } from "./Head";
import { StateDataProvider } from "@/state/DataProvider";

export type PageProps = ComponentProps<
  BoxProps,
  {
    headProps?: HeadProps;
    headerProps?: Omit<HeaderProps, "children">;
    mainProps?: Omit<BoxProps, "children">;
    footerProps?: Omit<FooterProps, "children">;
    withHeader?: boolean;
    withFooter?: boolean;
  }
>;

export function Page({
  children,
  headProps,
  mainProps,
  headerProps,
  footerProps,
  withHeader = true,
  withFooter = true,
  ...props
}: PageProps) {
  let _children;
  if (children) {
    _children = (
      <Box
        as="main"
        flex="1 0 auto"
        w="full"
        maxW="full"
        bg="white"
        borderBottomRadius="15px"
        pb="8"
        zIndex="1"
        {...mainProps}
      >
        {children}
      </Box>
    );
  }

  return (
    <>
      <Head {...headProps} />
      <StateDataProvider />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        w="full"
        maxW="full"
        minH="100vh"
        overflowX="hidden"
        overflowY="auto"
        {...props}
      >
        {withHeader && <Header {...headerProps} />}

        {_children}

        {withFooter && <Footer {...footerProps} />}
      </Box>
    </>
  );
}
