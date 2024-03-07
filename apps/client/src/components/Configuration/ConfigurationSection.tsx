import { ComponentProps } from "@/types/common";

import { connectionState } from "@/state/connection";

import { SectionProps } from "../common/Section";
import { ApplicationParameters } from "@/components/ApplicationParameters";
import { Box, Button, keyframes, useDisclosure } from "@chakra-ui/react";
import { Typography } from "@/components/common/Typography";
import { ConfigurationModal } from "@/components/Configuration/ConfigurationModal";
import { useSearchParams } from "@/hooks/useSearchParams";

export type ConfigurationSectionProps = ComponentProps<SectionProps>;

const pulseAnimation = keyframes({
  "0%": {
    transform: "scale(1, 1)"
  },

  "50%": {
    transform: "scale(1.033, 1.033)"
  },

  "100%": {
    transform: "scale(1, 1)"
  }
});

export function ConfigurationSection({ ...props }: ConfigurationSectionProps) {
  const { paramsObject } = useSearchParams<{ modalOpen?: "1" }>();
  const _connectionState = connectionState.useValue();
  const { onClose: closeModal, ...modal } = useDisclosure({ defaultIsOpen: paramsObject.modalOpen === "1" });

  return (
    <ApplicationParameters
      {...props}
      title="SingleStore Parameters"
      headerProps={{ display: "flex", alignItems: "center" }}
      headerChildren={
        _connectionState.isExist && (
          <Button
            ml="auto"
            size="s2.sm"
            onClick={modal.onOpen}
          >
            Change connection
          </Button>
        )
      }
      connection="config"
      position="relative"
      isPlaceholder={!_connectionState.isExist}
    >
      {!_connectionState.isExist && (
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="rgba(0, 0, 0, 0.15);"
          backdropFilter="auto"
          backdropBlur="8px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="4"
        >
          <Typography as="p">Get 100x faster analytics with SingleStore Kai™</Typography>
          <Button
            type="button"
            onClick={modal.onOpen}
            variant="solid"
            size="s2.md"
            mb="4"
            animation={`${pulseAnimation} 1.8s ease-out infinite`}
            _hover={{ animationPlayState: "paused" }}
          >
            Unlock the power
            <Box
              as="span"
              fontSize="larger"
              ml="0.25em"
            >
              ✨
            </Box>
          </Button>
        </Box>
      )}

      <ConfigurationModal
        isOpen={modal.isOpen}
        onClose={closeModal}
      />
    </ApplicationParameters>
  );
}
