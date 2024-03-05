import { useId } from "react";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { ComponentProps } from "@/types/common";
import { ConfigurationForm } from "@/components/Configuration/ConfigurationForm";
import { ConnectHelpModal } from "@/components/Connect/ConnectHelpModal";
import { Modal, ModalProps } from "@/components/common/Modal";
import { Typography } from "@/components/common/Typography";

export type ConfigurationModalProps = ComponentProps<ModalProps>;

export function ConfigurationModal({ onClose, ...props }: ConfigurationModalProps) {
  const modalHelp = useDisclosure();
  const formId = useId();

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
          />

          <Box
            display="flex"
            alignItems="center"
          >
            <Button
              variant="link"
              fontWeight="normal"
              onClick={modalHelp.onOpen}
            >
              Need help?
            </Button>
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

      <ConnectHelpModal
        contentProps={{
          color: "white",
          bg: "s2.gray.900",
          ...props.contentProps
        }}
        isOpen={modalHelp.isOpen}
        onClose={modalHelp.onClose}
      />
    </Modal>
  );
}
