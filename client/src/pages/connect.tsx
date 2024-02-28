import { useCallback, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { Image } from "@chakra-ui/next-js";

import { ROUTES } from "@/constants/routes";
import { COOKIE_KEYS } from "@/constants/cookie";
import { IS_SINGLE_DB } from "@/constants/env";
import { ConnectionConfig } from "@/types/api";
import { Defined } from "@/types/helpers";
import { api } from "@/api";
import { apiInstance } from "@/api/instance";
import { Logo } from "@/components/Logo";
import { FormProps } from "@/components/common/Form";
import { Page } from "@/components/common/Page";
import { Typography } from "@/components/common/Typography";
import { ConnectModal } from "@/components/Connect/ConnectModal";
import { ConnectLoader } from "@/components/Connect/ConnectLoader";
import { Link } from "@/components/common/Link";
import { ConfigurationForm } from "@/components/ConfigurationForm";

export default function Connect({ shouldSetData = false }: { shouldSetData?: boolean }) {
  const [loaderSate, setLoaderSate] = useState({ title: "", message: "", isOpen: shouldSetData });
  const modal = useDisclosure();

  const resetLoaderState = useCallback(() => {
    setLoaderSate({ title: "", message: "", isOpen: false });
  }, []);

  const handleError = useCallback((error: unknown) => {
    console.error(error);
    resetLoaderState();
  }, []);

  const createConnection = useCallback(async (values: ConnectionConfig) => {
    setLoaderSate((state) => ({ ...state, title: "Connection", isOpen: true }));
    await api.connection.create(values);
    await api.user.create();
  }, []);

  const validateData = useCallback(() => {
    setLoaderSate((state) => ({ ...state, title: "Data validation" }));
    return api.data.validate();
  }, []);

  const setData = useCallback(() => {
    setLoaderSate((state) => ({
      ...state,
      title: "Data inserting",
      message: `It will take a while. Do not close the browser tab.`,
    }));
    return api.data.set();
  }, []);

  const handleDataSuccess = useCallback(() => {
    setLoaderSate((state) => ({
      ...state,
      title: "Success",
      message: "You will be redirected to the product catalog.",
    }));

    window.location.replace(ROUTES.root);
  }, []);

  const handleFormSubmit = useCallback<Defined<FormProps["onSubmit"]>>(async (values) => {
    try {
      await createConnection(values);
      // const isDataValid = await validateData();
      // if (!isDataValid.data) await setData();

      handleDataSuccess();
    } catch (error) {
      handleError(error);
    }
  }, []);

  // useEffect(() => {
  //   if (!shouldSetData) return;

  //   (async () => {
  //     try {
  //       await setData();
  //       handleDataSuccess();
  //     } catch (error) {
  //       handleError(error);
  //     }
  //   })();
  // }, [shouldSetData, setData, handleDataSuccess, handleError]);

  const loader = <ConnectLoader {...loaderSate} />;

  // if (shouldSetData) return loader;

  return (
    <Page
      withHeader={false}
      withFooter={false}
      mainProps={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        p: 0,
        pt: { base: "6", md: "12", lg: 0 },
      }}
    >
      <Box
        display="flex"
        flex="1"
        w="full"
        alignItems={{ lg: "center" }}
        justifyContent={{ base: "center", lg: "flex-start" }}
        flexWrap="wrap"
      >
        <Box
          flex="1"
          maxW="36.55rem"
          ml={{ lg: "8.08%" }}
          px={{ base: "4", lg: "0" }}
          zIndex={2}
          backdropFilter="blur(2px)"
        >
          <Logo variant="s2.eStore" display="flex" maxW="480px" />
          <Typography as="p" fontSize="xl" mt="5">
            Watch{" "}
            <Typography as="span" fontWeight="semibold" color="s2.indigo.600" textDecoration="underline">
              <Link href="https://portal.singlestore.com/">SingleStoreDB</Link>
            </Typography>{" "}
            serve a mix of transactions and aggregates in a retail experience based on a user’s purchases and
            product ratings.
          </Typography>

          <Box>
            <Typography
              as="p"
              fontSize="md"
              color="s2.indigo.600"
              fontWeight="semibold"
              px="4"
              py="2"
              borderBottom="2px"
              mt="6"
              display="inline-block"
            >
              Connect to SingleStore
            </Typography>

            <ConfigurationForm onSubmit={handleFormSubmit} formProps={{ maxW: "30rem", mt: "8" }}>
              <Button type="submit" mt="2" variant="solid" w="full">
                Connect
              </Button>
            </ConfigurationForm>

            <Button
              variant="link"
              fontWeight="normal"
              fontSize="lg"
              color="s2.indigo.600"
              mt="12"
              onClick={modal.onOpen}
            >
              Need help?
            </Button>
          </Box>
        </Box>
        <Box
          position={{ lg: "absolute" }}
          display="flex"
          w="full"
          top="50%"
          right="0"
          transform={{ lg: "translateY(-50%)" }}
        >
          <Box
            position="relative"
            w="clamp(512px, 52%, 100vh)"
            overflow="hidden"
            ml="auto"
            mt="auto"
            __css={{
              "& .image": {
                transition: "all 0.2s ease",
                objectFit: "cover",
                zIndex: "1",
              },
            }}
          >
            <Box display="block" pt="93.63%" pointerEvents="none" />
            <Image
              src="/assets/images/ConnectImage.png"
              alt="Connect image"
              fill
              sizes="(max-width: 768px) 50vw, 100vw"
              className="image"
            />
          </Box>
        </Box>
      </Box>

      <ConnectModal isOpen={modal.isOpen} onClose={modal.onClose} />
      {loader}
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    if (COOKIE_KEYS.connectionConfig in context.req.cookies) {
      return {
        props: {},
        redirect: {
          destination: ROUTES.root,
          permanent: false,
        },
      };
    }

    if (IS_SINGLE_DB) {
      const connectionResponse = await api.connection.create();
      apiInstance.defaults.headers.cookie = connectionResponse.headers["set-cookie"]?.[0] ?? "";

      const userResponse = await api.user.create();
      const userSetCookie = userResponse.headers["set-cookie"]?.[0] ?? "";
      apiInstance.defaults.headers.cookie = userSetCookie;
      context.res.setHeader("set-cookie", userSetCookie ?? "");

      const isDataValidRes = await api.data.validate();

      if (!isDataValidRes.data) {
        return { props: { shouldSetData: true } };
      }

      return {
        props: {},
        redirect: {
          destination: ROUTES.root,
          permanent: false,
        },
      };
    }

    return { props: {} };
  } catch (error) {
    console.error(error);
    return { props: {} };
  }
};
