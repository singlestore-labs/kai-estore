import { switchAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(switchAnatomy.keys);

export const switchTheme = defineMultiStyleConfig({
  sizes: {
    "s2.md": definePartsStyle({
      track: {
        w: "32px",
        h: "16px",
        display: "inline-flex",
        alignItems: "center",
        px: "1"
      },

      thumb: {
        w: "3.5",
        h: "3.5",
        _checked: {
          transform: `translateX(18px)`
        }
      }
    })
  },

  variants: { "1": definePartsStyle({ track: { bgColor: "currentcolor" } }) }
});
