import { Button, Flex } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { ROUTES } from "@/constants/routes";

import { Icon } from "@/components/common/Icon";
import { Typography } from "@/components/common/Typography";
import { Modal, ModalProps } from "@/components/common/Modal";
import { Link } from "@/components/common/Link";

export type CartSuccessModalProps = ComponentProps<ModalProps>;

export function CartSuccessModal({ onClose, ...props }: CartSuccessModalProps) {
  return (
    <Modal
      size="s2.md"
      {...props}
      onClose={onClose}
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        textAlign="center"
        mx="auto"
        maxW="500px"
      >
        <Icon
          name="solid.faCheckCircle"
          color="s2.purple.800"
          w="14"
        />

        <Typography
          as="h2"
          fontSize="2xl"
          lineHeight="8"
          fontWeight="semibold"
          mt="3"
        >
          Your order is complete!
        </Typography>

        <Typography
          as="p"
          fontSize="md"
          lineHeight="6"
          fontWeight="normal"
          mt="3"
        >
          Return to Catalog to view new recommendations based on your purchase or test sample queries.
        </Typography>

        <Flex
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
          mt="6"
          gap="3"
        >
          <Button
            variant="solid.secondary"
            size="s2.md"
            borderRadius="full"
            onClick={onClose}
          >
            Return to Catalog
          </Button>

          <Link
            href={ROUTES.analytics}
            chakra={{ variant: "solid", size: "s2.md" }}
          >
            Explore Analytics
          </Link>
        </Flex>
      </Flex>
    </Modal>
  );
}
