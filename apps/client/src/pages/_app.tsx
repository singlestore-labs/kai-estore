import { useMemo } from "react";
import { AppProps } from "next/app";
import Script from "next/script";
import { RecoilEnv, RecoilRoot } from "recoil";
import { Box, ChakraProvider } from "@chakra-ui/react";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inconsolata/400.css";

import { theme } from "@/theme";
import { initializeRecoilState } from "@/state";
import { ToastContainer } from "@/utils/toast";
import { SocketController } from "@/events/io";
import { StateController } from "@/components/StateController";
import { IS_UNDER_DEVELOPMENT } from "@/constants/env";

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export default function App({ Component, pageProps }: AppProps) {
  const initializeState = useMemo(() => {
    return pageProps.rootState ? initializeRecoilState(pageProps.rootState) : undefined;
  }, [pageProps.rootState]);

  if (IS_UNDER_DEVELOPMENT) {
    return (
      <ChakraProvider theme={theme}>
        <Box
          p="8"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="100vw"
          h="100vh"
        >
          <p>We are working on the app. Please come back later.</p>
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <RecoilRoot initializeState={initializeState}>
      <ChakraProvider theme={theme}>
        <Script
          src="lib/intercom.js"
          strategy="lazyOnload"
        />
        <Component {...pageProps} />
        <ToastContainer />
      </ChakraProvider>
      <SocketController />
      <StateController />
    </RecoilRoot>
  );
}
