import { useEffect, useState } from "react";
import { Box, Button } from "@chakra-ui/react";

import { ConnectionConfig } from "@/types/api";
import { ROUTES } from "@/constants/routes";
import { WITH_DATA_GENERATION, IS_SINGLE_DB } from "@/constants/env";
import { api } from "@/api";
import { getDefaultServerSideProps } from "@/utils/next";
import { Page } from "@/components/common/Page";
import { Section } from "@/components/common/Section";
import { Typography } from "@/components/common/Typography";
import { FormProps } from "@/components/common/Form";
import { ConfigurationForm } from "@/components/Configuration/ConfigurationForm";
import { ConnectLoader } from "@/components/Connect/ConnectLoader";

const formId = "configuration";

export default function Configure() {
  const [initialValues, setInitialValues] = useState<ConnectionConfig | undefined>();
  const [isInitialValuesLoading, setIsInitialValuesLoading] = useState(true);
  const [loaderSate, setLoaderSate] = useState({ title: "", message: "", isOpen: false });

  const handleFormSubmit: FormProps["onSubmit"] = async (values) => {
    try {
      let timeout: NodeJS.Timeout | undefined = undefined;

      setLoaderSate((state) => ({ ...state, title: "Updating", isOpen: true }));

      await api.connection.update(values, { connection: "config" });

      if (WITH_DATA_GENERATION) {
        setLoaderSate((state) => ({ ...state, title: "Data validation" }));
        const isDataValidRes = await api.data.validate({ connection: "config" });

        if (!isDataValidRes.data) {
          setLoaderSate((state) => ({
            ...state,
            title: "Data inserting",
            message: `It will take a while. Do not close the browser tab.`
          }));
          await api.data.set({ connection: "config" });
        }
      }

      setLoaderSate((state) => ({ ...state, title: "Success", message: "The page will be reloaded." }));

      timeout = setTimeout(() => {
        clearTimeout(timeout);
        window.location.reload();
      }, 2000);
    } catch (error) {
      setLoaderSate({ title: "", message: "", isOpen: false });
    }
  };

  const handleResetClick = async () => {
    try {
      let timeout: NodeJS.Timeout | undefined = undefined;

      setLoaderSate((state) => ({
        ...state,
        title: "Data reset",
        message: `It will take a while. Do not close the browser tab.`,
        isOpen: true
      }));

      await api.data.reset({ connection: "config" });

      setLoaderSate((state) => ({ ...state, title: "Success", message: "The page will be reloaded." }));

      timeout = setTimeout(() => {
        clearTimeout(timeout);
        window.location.reload();
      }, 2000);
    } catch (error) {
      setLoaderSate({ title: "", message: "", isOpen: false });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setIsInitialValuesLoading(true);
        const response = await api.connection.get({ connection: "config" });
        delete (response.data as any).userId;
        setInitialValues({ ...response.data, shouldGenerateData: false });
      } catch (error) {
        setInitialValues(undefined);
      } finally {
        setIsInitialValuesLoading(false);
      }
    })();
  }, []);

  return (
    <Page mainProps={{ color: "white", bg: "s2.gray.900" }}>
      <Section
        variant="2"
        title="Setting Up Your Application"
        description={`Connect to a SingleStoreDB Workspace to see how we power transaction and analytics. If you have any questions or run into issues, please file a ticket on the GitHub repo, or report it on our forum.`}
        mt="6"
      >
        <Section
          variant="3"
          title="Connect to SingleStoreDB"
        >
          {!isInitialValuesLoading && (
            <Box
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              alignItems="flex-start"
              gap="12"
            >
              <Box>
                <Typography as="p">
                  Fill out the fields with your connection string, database name and select size.
                </Typography>
              </Box>
              <Box>
                <ConfigurationForm
                  id={formId}
                  variant="dark"
                  initialValues={initialValues}
                  onSubmit={handleFormSubmit}
                  isDisabled={isInitialValuesLoading}
                />
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  gap="3"
                  mt="8"
                >
                  <Button
                    type="submit"
                    form={formId}
                    variant="solid"
                    isDisabled={isInitialValuesLoading}
                  >
                    Save configuration
                  </Button>
                  {WITH_DATA_GENERATION && (
                    <Button
                      type="button"
                      variant="solid"
                      bg="red.500"
                      _hover={{ bg: "red.600" }}
                      _active={{ bg: "red.700" }}
                      onClick={handleResetClick}
                      isDisabled={isInitialValuesLoading}
                    >
                      Reset data
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Section>
      </Section>

      <ConnectLoader
        {...loaderSate}
        variant="dark"
      />
    </Page>
  );
}

export const getServerSideProps = getDefaultServerSideProps({
  redirect: IS_SINGLE_DB ? ROUTES.root : undefined
});
