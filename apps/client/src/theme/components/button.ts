import { ChakraProps, defineStyle, defineStyleConfig } from "@chakra-ui/react";

import { BUTTON_VARIANT_NAMES } from "@/constants/theme";

const sizeStyles: Record<string, ChakraProps> = {
  "md": {
    minW: "10",
    minH: "10"
  },

  "s2.md": {
    fontSize: "md",
    lineHeight: "6",
    py: "2",
    px: "4"
  },

  "s2.sm": {
    fontSize: "sm",
    lineHeight: "1",
    h: "auto",
    minH: "auto",
    py: "2",
    px: "4"
  }
};

export const buttonTheme = defineStyleConfig({
  variants: {
    [BUTTON_VARIANT_NAMES.solid]: defineStyle(({ size }) => {
      const _disabled = {
        color: "s2.purple.400",
        bg: "s2.purple.200",
        opacity: "1"
      };

      return {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        "color": "white",
        "textDecoration": "none",
        "fontWeight": "semibold",
        "bg": "s2.purple.800",
        "borderRadius": "full",
        "p": "3",
        ...sizeStyles[size],

        "[fill]": {
          fill: "currentColor"
        },

        "_hover": {
          textDecoration: "none",
          bg: "s2.purple.800",

          _disabled
        },

        "_active": {
          bg: "s2.purple.800"
        },

        _disabled
      };
    }),

    [BUTTON_VARIANT_NAMES["solid.secondary"]]: defineStyle(({ size }) => {
      const _disabled = {
        color: "s2.gray.400",
        bg: "s2.gray.100",
        opacity: "1"
      };

      return {
        color: "black",
        textDecoration: "none",
        bg: "s2.gray.200",
        border: "none",
        p: "4",
        ...sizeStyles[size],

        _hover: {
          textDecoration: "none",
          bg: "s2.gray.300",

          _disabled
        },

        _active: {
          bg: "s2.gray.400"
        },

        _disabled
      };
    }),

    [BUTTON_VARIANT_NAMES.outline]: defineStyle(({ size }) => ({
      "display": "flex",
      "alignItems": "center",
      "justifyContent": "center",
      "color": "s2.purple.800",
      "textDecoration": "none",
      "minW": "10",
      "minH": "10",
      "bg": "none",
      "border": "1px solid",
      "borderColor": "currentColor",
      "borderRadius": "full",
      "p": "0",
      ...sizeStyles[size],

      "[fill]": {
        fill: "currentColor"
      },

      "[stroke]": {
        stroke: "currentColor"
      },

      "_hover": {
        textDecoration: "none",
        bg: "s2.purple.200"
      },

      "_active": {
        bg: "s2.purple.200"
      }
    })),

    [BUTTON_VARIANT_NAMES["outline.secondary"]]: defineStyle(({ size }) => ({
      "display": "flex",
      "alignItems": "center",
      "justifyContent": "center",
      "fontWeight": "semibold",
      "lineHeight": "6",
      "color": "s2.gray.800",
      "textDecoration": "none",
      "minW": "10",
      "minH": "10",
      "bg": "none",
      "border": "1px solid",
      "borderColor": "s2.gray.400",
      "borderRadius": "full",
      "p": "0",
      ...sizeStyles[size],

      "[fill]": {
        fill: "currentColor"
      },

      "[stroke]": {
        stroke: "currentColor"
      },

      "_hover": {
        textDecoration: "none",
        bg: "s2.gray.50"
      },

      "_active": {
        bg: "s2.gray.200"
      },

      "&.isActive": {
        color: "white",
        bg: "s2.purple.800",
        transition: 0
      }
    })),

    [BUTTON_VARIANT_NAMES.ghost]: defineStyle(({ size }) => ({
      "fontSize": "lg",
      "fontWeight": "semibold",
      "lineHeight": "7",
      "color": "gray.800",
      "textDecoration": "none",
      "minW": "10",
      "minH": "10",
      "borderRadius": "full",
      "py": "2.5",
      "px": "6",
      ...sizeStyles[size],

      "_hover": {
        textDecoration: "none",
        bg: "s2.purple.200"
      },

      // _active: {
      //   color: "white",
      //   bg: "s2.purple.800",
      // },

      "&.isActive": {
        color: "white",
        bg: "s2.purple.800",
        transition: 0
      },

      "&.isDisabled": {
        color: "s2.gray.400",
        bg: "none",
        pointerEvents: "none",
        opacity: "1"
      }
    }))
  }
});
