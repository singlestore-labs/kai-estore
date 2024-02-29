import { extendTheme } from "@chakra-ui/react";

import { s2colors } from "./colors";

import { buttonTheme } from "./components/button";
import { checkboxTheme } from "./components/checkbox";
import { containerTheme } from "./components/container";
import { inputTheme } from "./components/input";
import { linkTheme } from "./components/link";
import { modalTheme } from "./components/modal";
import { switchTheme } from "./components/switch";
import { textareaTheme } from "./components/textarea";
import { selectTheme } from "./components/select";

export const theme = extendTheme({
  fonts: {
    heading: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    body: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`
  },

  colors: s2colors,

  components: {
    Button: buttonTheme,
    Checkbox: checkboxTheme,
    Container: containerTheme,
    Input: inputTheme,
    Link: linkTheme,
    Modal: modalTheme,
    Switch: switchTheme,
    Textarea: textareaTheme,
    Select: selectTheme
  },

  styles: {
    global: () => ({
      "html, body": {
        color: "s2.gray.900"
      }
    })
  }
});
