import { checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(checkboxAnatomy.keys);

export const checkboxTheme = defineMultiStyleConfig({
  variants: {
    "1": definePartsStyle({
      control: {
        _checked: {
          bg: "s2.indigo.600",
          borderColor: "s2.indigo.600",

          _hover: {
            bg: "s2.indigo.600",
            borderColor: "s2.indigo.600",
          },
        },
      },

      label: {
        fontSize: "sm",

        "&:first-letter": {
          textTransform: "uppercase",
        },
      },
    }),
  },
});
