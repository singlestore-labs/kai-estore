import { useMemo } from "react";
import { AppProps } from "next/app";
import { RecoilEnv, RecoilRoot } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inconsolata/400.css";

import { theme } from "@/theme";
import { initializeRecoilState } from "@/state";
import { ToastContainer } from "@/utils/toast";

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export default function App({ Component, pageProps }: AppProps) {
  const initializeState = useMemo(() => {
    return pageProps.rootState ? initializeRecoilState(pageProps.rootState) : undefined;
  }, [pageProps.rootState]);

  return (
    <RecoilRoot initializeState={initializeState}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
        <ToastContainer />
      </ChakraProvider>
    </RecoilRoot>
  );
}
