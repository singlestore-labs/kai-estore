import { createStandaloneToast } from "@chakra-ui/react";

import { theme } from "@/theme";

export const { ToastContainer, toast: standaloneToast } = createStandaloneToast({ theme });

export const errorToast = (...[props, ...args]: Parameters<typeof standaloneToast>) => {
  standaloneToast(
    {
      duration: 3000,
      status: "error",
      isClosable: true,
      ...props,
    },
    ...args,
  );
};
