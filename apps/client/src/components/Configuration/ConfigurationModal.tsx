import { useCallback, useId, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ComponentProps } from "@/types/common";
import { ConfigurationForm, ConfigurationFormProps } from "@/components/Configuration/ConfigurationForm";
import { ConnectLoader } from "@/components/Connect/ConnectLoader";
import { ConnectionConfig } from "@/types/api";
import { Defined } from "@/types/helpers";
import { Link } from "@/components/common/Link";
import { Modal, ModalProps } from "@/components/common/Modal";
import { Typography } from "@/components/common/Typography";
import { api } from "@/api";

export type ConfigurationModalProps = ComponentProps<ModalProps, { onSuccess?: () => void }>;

export function ConfigurationModal({ onClose, onSuccess, ...props }: ConfigurationModalProps) {
  const formId = useId();
  const [loaderState, setLoaderState] = useState({ title: "", message: "", isOpen: false });

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

  const setData = useCallback(() => {
    setLoaderState((state) => ({
      ...state,
      title: "Data inserting",
      message: `It will take up to 3 minutes. Do not close the modal.`
    }));
    return api.data.set({ connection: "config", force: true });
  }, []);

  const handleSuccess = useCallback(() => {
    onSuccess?.();
    resetLoaderState();
  }, [onSuccess, resetLoaderState]);

  const handleFormSubmit = useCallback<Defined<ConfigurationFormProps["onSubmit"]>>(
    async (values) => {
      try {
        await createConnection({ ...values, withCDC: true });
        const isDataValid = await validateData();
        if (!isDataValid.data) await setData();
        handleSuccess();
      } catch (error) {
        handleError(error);
      }
    },
    [createConnection, handleSuccess, handleError, setData, validateData]
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
              <Typography color="s2.gray.600">{`Don't have a workspace?`}</Typography>
              <Link href="https://www.singlestore.com/cloud-trial/kai">Click to create</Link>
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
    </Modal>
  );
}
