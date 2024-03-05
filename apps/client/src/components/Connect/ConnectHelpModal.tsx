import { Box, HStack } from "@chakra-ui/react";
import Image from "next/image";

import { ComponentProps } from "@/types/common";
import { Modal, ModalProps } from "@/components/common/Modal";
import { Typography } from "../common/Typography";

export type ConnectHelpModalProps = ComponentProps<ModalProps>;

const steps = [
  {
    image: "/assets/images/connect-workspace.png",
    title: "1. Connect Your Workspace",
    description: "In the Connect flyout on your workspace select Connect Directly."
  },
  {
    image: "/assets/images/navigate-mongodb-client.png",
    title: "2. Navigate to MongoDB® Client",
    description: "Select MongoDB® Client from the Connect to Workspace menu."
  },
  {
    image: "/assets/images/copy-connection-string.png",
    title: "3. Copy the MongoDB® Connection String URI",
    description: `Ensure the IP address you will connect to the workspace group has been added to the inbound connection list. Note: You can reset a workspace group's password under the "Access" tab.`
  }
];

export function ConnectHelpModal({ onClose, ...props }: ConnectHelpModalProps) {
  return (
    <Modal
      size="s2.md"
      {...props}
      onClose={onClose}
    >
      <Typography
        as="h2"
        fontSize="2xl"
        lineHeight="8"
        fontWeight="semibold"
      >
        How to connect the demo application to SingleStore?
      </Typography>
      <HStack
        spacing="8"
        align="flex-start"
        mt="6"
        wrap={{ base: "wrap", md: "nowrap" }}
      >
        {steps.map((step) => (
          <Box
            key={step.title}
            display="flex"
            flexDirection="column"
            alignItems="center"
            w="full"
            maxW="full"
          >
            <Image
              width={272}
              height={149}
              src={step.image}
              alt={step.title}
            />
            <Box mt="8">
              <Typography
                as="h4"
                fontSize="sm"
                lineHeight="5"
                fontWeight="bold"
              >
                {step.title}
              </Typography>
              <Typography
                as="p"
                fontSize="sm"
                lineHeight="5"
              >
                {step.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </HStack>
    </Modal>
  );
}
