import { ComponentProps } from "@/types/common";

import { connectionState } from "@/state/connection";

import { SectionProps } from "../common/Section";
import { ApplicationParameters } from "@/components/ApplicationParameters";
import { Box, Button, keyframes, useDisclosure } from "@chakra-ui/react";
import { Typography } from "@/components/common/Typography";
import { ConfigurationModal } from "@/components/Configuration/ConfigurationModal";
import { useSearchParams } from "@/hooks/useSearchParams";
import { cdcState } from "@/state/cdc";
import { Loader } from "@/components/common/Loader";
import { useEffect, useRef } from "react";
import { ioEvents } from "@/events/io";

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
  const [_cdcState, setCDCState] = cdcState.useState();
  const { onClose: closeModal, ...modal } = useDisclosure({ defaultIsOpen: paramsObject.modalOpen === "1" });
  const isCDCSubscribedRef = useRef(false);

  useEffect(() => {
    if (isCDCSubscribedRef.current) return;
    ioEvents.cdc.emit();
    isCDCSubscribedRef.current = true;
    const remove = ioEvents.cdc.onData(setCDCState);
    return () => {
      remove();
      ioEvents.cdc.off();
      isCDCSubscribedRef.current = false;
    };
  }, [setCDCState]);

  return (
    <ApplicationParameters
      {...props}
      title="SingleStore Parameters"
      headerProps={{ display: "flex", alignItems: "center" }}
      headerChildren={
        <>
          {_connectionState.isExist && (
            <Button
              ml="auto"
              size="s2.sm"
              onClick={modal.onOpen}
            >
              Change connection
            </Button>
          )}
        </>
      }
      bodyProps={{ position: "initial" }}
      connection="config"
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

      {_cdcState.status === "cloning" && (
        <Box
          flex="1 0 100%"
          display="flex"
          alignItems="center"
          gap="2"
          pb="1"
        >
          <Box
            position="relative"
            flex="0 0 20px"
          >
            <Loader
              overlayProps={{ bg: "transparent" }}
              circleWrapperProps={{ w: "full" }}
              isOpen
            />
          </Box>

          <Typography color="white">Data cloning</Typography>
        </Box>
      )}

      <ConfigurationModal
        isOpen={modal.isOpen}
        onClose={closeModal}
      />
    </ApplicationParameters>
  );
}
