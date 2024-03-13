import { useCallback, useId, useState } from "react";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { ComponentProps } from "@/types/common";
import { ConfigurationForm, ConfigurationFormProps } from "@/components/Configuration/ConfigurationForm";
import { ConnectLoader } from "@/components/Connect/ConnectLoader";
import { ConnectionConfig } from "@/types/api";
import { Defined } from "@/types/helpers";
import { Link } from "@/components/common/Link";
import { Modal, ModalProps } from "@/components/common/Modal";
import { Typography } from "@/components/common/Typography";
import { api } from "@/api";
import { ConnectHelpModal } from "@/components/Connect/ConnectHelpModal";

export type ConfigurationModalProps = ComponentProps<ModalProps, { onSuccess?: () => void }>;

export function ConfigurationModal({ onClose, ...props }: ConfigurationModalProps) {
  const formId = useId();
  const [loaderState, setLoaderState] = useState({ title: "", message: "", isOpen: false });
  const helpModal = useDisclosure();

  const resetLoaderState = useCallback(() => {
    setLoaderState({ title: "", message: "", isOpen: false });
  }, []);

  const handleError = useCallback(
    (error: unknown) => {
      console.error(error);
      resetLoaderState();
    },
    [resetLoaderState]
  );

  const createConnection = useCallback(async (values: ConnectionConfig) => {
    setLoaderState((state) => ({ ...state, title: "Connection", isOpen: true }));
    await api.connection.create(values);
    await api.user.create();
  }, []);

  const validateData = useCallback(() => {
    setLoaderState((state) => ({ ...state, title: "Data validation" }));
    return api.data.validate({ connection: "config" });
  }, []);

  const setupCDC = useCallback(() => {
    setLoaderState((state) => ({
      ...state,
      title: "CDC Setup",
      message: `It will take a few seconds. Do not close the modal.`
    }));
    return api.cdc.setup({ connection: "config" });
  }, []);

  const handleSuccess = useCallback(() => {
    setLoaderState((state) => ({
      ...state,
      title: "Success",
      message: "The page will be reloaded."
    }));
    window.location.reload();
  }, []);

  const handleFormSubmit = useCallback<Defined<ConfigurationFormProps["onSubmit"]>>(
    async (values) => {
      try {
        await createConnection(values);
        const isDataValid = await validateData();
        if (!isDataValid.data) await setupCDC();
        handleSuccess();
      } catch (error) {
        handleError(error);
      }
    },
    [createConnection, handleSuccess, handleError, setupCDC, validateData]
  );

  return (
    <Modal
      size="s2.md"
      {...props}
      contentProps={{
        color: "white",
        bg: "s2.gray.900",
        ...props.contentProps
      }}
      onClose={onClose}
    >
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-start"
        position="relative"
        gap="8"
      >
        <Typography
          as="h2"
          fontSize="2xl"
          lineHeight="8"
          fontWeight="semibold"
        >
          Get 100x faster analytics with SingleStore Kai™
        </Typography>

        <Box
          display="flex"
          flexDirection="column"
          gap="8"
        >
          <ConfigurationForm
            id={formId}
            variant="dark"
            initialValues={{ withCDC: true }}
            withDataGeneration={false}
            onSubmit={handleFormSubmit}
          />

          <Box
            display="flex"
            alignItems="center"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
            >
              <Typography>{`Don't have a SingleStore account?`}</Typography>
              <Link
                href="https://www.singlestore.com/cloud-trial/kai"
                chakra={{ color: "s2.purple.600" }}
              >
                Sign up for a free trial
              </Link>

              <Button
                type="button"
                onClick={helpModal.onOpen}
                bg="none"
                fontSize="inherit"
                fontWeight="normal"
                h="auto"
                minH="initial"
                color="s2.gray.600"
                mt="4"
                p="0"
                _hover={{ bg: "none", color: "white", textDecoration: "underline" }}
              >
                How to connect?
              </Button>
            </Box>

            <Button
              type="submit"
              form={formId}
              variant="solid"
              ml="auto"
            >
              Connect
            </Button>
          </Box>
        </Box>
      </Box>

      <ConnectLoader
        {...loaderState}
        position="absolute"
        variant="dark"
        inPortal={false}
      />

      <ConnectHelpModal
        isOpen={helpModal.isOpen}
        onClose={helpModal.onClose}
        contentProps={{ color: "white", bg: "s2.gray.900" }}
      />
    </Modal>
  );
}
