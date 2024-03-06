import { useId } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ComponentProps } from "@/types/common";
import { ConfigurationForm } from "@/components/Configuration/ConfigurationForm";
import { Modal, ModalProps } from "@/components/common/Modal";
import { Typography } from "@/components/common/Typography";
import { Link } from "@/components/common/Link";

export type ConfigurationModalProps = ComponentProps<ModalProps>;

export function ConfigurationModal({ onClose, ...props }: ConfigurationModalProps) {
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
    </Modal>
  );
}
