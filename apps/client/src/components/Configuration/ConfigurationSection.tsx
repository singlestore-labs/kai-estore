import { ComponentProps } from "@/types/common";

import { connectionState } from "@/state/connection";

import { Section, SectionProps } from "../common/Section";
import { ApplicationParameters } from "@/components/ApplicationParameters";
import { Box, Button, keyframes } from "@chakra-ui/react";

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
  const [_connectionState, setConnectionState] = connectionState.useState();

  const handleUnlockClick = () => {
    console.log("Unlock the power");
    setConnectionState((state) => ({ ...state, isExist: !state.isExist }));
  };

  return (
    <ApplicationParameters
      {...props}
      title="SingleStore Parameters"
      connection="config"
      position="relative"
      isPlaceholder={!_connectionState.isExist}
    >
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
        alignItems="center"
        justifyContent="center"
      >
        <Button
          type="button"
          onClick={handleUnlockClick}
          variant="solid"
          size="s2.md"
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
    </ApplicationParameters>
  );
}
