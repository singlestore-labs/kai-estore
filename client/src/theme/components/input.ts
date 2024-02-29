import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys);

export const inputTheme = defineMultiStyleConfig({
  sizes: {
    "s2.md": definePartsStyle({
      field: defineStyle({
        fontSize: "sm",
        py: "2",
        px: "3",
      }),
    }),
  },

  variants: {
    filled: definePartsStyle({
      field: {
        bg: "white",
        border: "1px",
        borderColor: "gray.200",

        _placeholder: {
          color: "gray.500",
        },

        _hover: {
          bg: "white",
          borderColor: "s2.purple.400",
        },

        _focus: {
          borderColor: "s2.purple.800",
        },
      },
    }),

    outline: definePartsStyle(() => {
      const _disabled = defineStyle({
        color: "s2.gray.400",
        bg: "s2.gray.900",
        borderColor: "transparent",
      });

      return defineStyle({
        field: {
          color: "white",
          borderWidth: "2px",
          borderColor: "s2.gray.800",
          borderRadius: "base",
          bg: "s2.gray.900",

          _placeholder: {
            color: "s2.gray.500",
          },

          _hover: {
            borderColor: "s2.purple.800",

            _disabled,
          },

          _focus: {
            borderColor: "s2.purple.800",
            outline: "none",
            boxShadow: "none",
          },

          _invalid: {
            borderColor: "s2.red.500",
          },

          _disabled,
        },
      });
    }),
  },
});
