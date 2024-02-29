import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const outline = defineStyle(() => {
  const _disabled = defineStyle({
    color: "s2.gray.400",
    bg: "s2.gray.900",
    borderColor: "transparent"
  });

  return defineStyle({
    color: "white",
    borderWidth: "2px",
    borderColor: "s2.gray.800",
    borderRadius: "base",
    bg: "s2.gray.900",

    _placeholder: {
      color: "s2.gray.500"
    },

    _hover: {
      borderColor: "s2.purple.800",
      _disabled
    },

    _focus: {
      borderColor: "s2.purple.800",
      outline: "none",
      boxShadow: "none"
    },

    _invalid: {
      borderColor: "s2.red.500"
    },

    _readOnly: {
      borderColor: "s2.gray.800",

      _hover: {
        borderColor: "s2.gray.800"
      },

      _focus: {
        borderColor: "s2.gray.800"
      }
    },

    _disabled
  });
});

export const textareaTheme = defineStyleConfig({
  sizes: {
    "s2.md": defineStyle({
      fontSize: "sm",
      p: "4"
    })
  },

  variants: {
    outline,

    "outline.code": {
      ...outline(),
      fontFamily: `Inconsolata, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
    }
  }
});
