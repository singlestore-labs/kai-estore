import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { defineStyle, createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

export const modalTheme = defineMultiStyleConfig({
  sizes: {
    "s2.md": definePartsStyle({
      dialog: defineStyle({ w: "100%", maxW: "1080px" }),
      body: defineStyle({ py: "68px", px: "72px" })
    })
  }
});
