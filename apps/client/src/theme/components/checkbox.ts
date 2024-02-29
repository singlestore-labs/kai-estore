import { checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(checkboxAnatomy.keys);

export const checkboxTheme = defineMultiStyleConfig({
  variants: {
    "1": definePartsStyle({
      control: {
        _checked: {
          bg: "s2.purple.800",
          borderColor: "s2.purple.800",

          _hover: {
            bg: "s2.purple.800",
            borderColor: "s2.purple.800"
          }
        }
      },

      label: {
        "fontSize": "sm",

        "&:first-letter": {
          textTransform: "uppercase"
        }
      }
    })
  }
});
