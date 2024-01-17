import { defineStyleConfig } from "@chakra-ui/react";

import { buttonTheme } from "./button";

export const linkTheme = defineStyleConfig({
  variants: buttonTheme.variants,
  sizes: buttonTheme.sizes,
});
