import { useEffect, useRef } from "react";
import { ComponentProps } from "@/types/common";

import { useIsConnectionExist } from "@/state/connection";

import { ApplicationParameters } from "@/components/ApplicationParameters";
import { Box, Button, keyframes, useDisclosure } from "@chakra-ui/react";
import { ConfigurationModal } from "@/components/Configuration/ConfigurationModal";
import { Loader } from "@/components/common/Loader";
import { SectionProps } from "@/components/common/Section";
import { Typography } from "@/components/common/Typography";
import { cdcState } from "@/state/cdc";
import { ioEvents } from "@/events/io";
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
  const isConnectionExist = useIsConnectionExist();
  const [_cdcState, setCDCState] = cdcState.useState();
  const { onClose: closeModal, ...modal } = useDisclosure({ defaultIsOpen: paramsObject.modalOpen === "1" });
  const isCDCSubscribedRef = useRef(false);
  const rootRef = useRef<any>(null);

  useEffect(() => {
    if (isCDCSubscribedRef.current || _cdcState.status === "ready") return;
    ioEvents.cdc.emit();
    isCDCSubscribedRef.current = true;
    const remove = ioEvents.cdc.onData((data) => {
      if (!data) return;
      if ("count" in data) {
        setCDCState(data.cdc);
        rootRef.current.setParams({
          ordersNumber: data.count.orders,
          productsNumber: data.count.products,
          ratingsNumber: data.count.ratings
        });
      } else {
        setCDCState(data);
      }
    });
    return () => {
      remove();
      ioEvents.cdc.off();
      isCDCSubscribedRef.current = false;
    };
  }, [setCDCState, _cdcState.status]);

  return (
    <ApplicationParameters
      {...props}
      ref={rootRef}
      title="SingleStore Parameters"
      headerProps={{ display: "flex", alignItems: "center" }}
      headerChildren={
        <>
          {isConnectionExist && (
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
      isPlaceholder={!isConnectionExist}
    >
      {!isConnectionExist && (
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
