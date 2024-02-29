import { keyframes } from "@emotion/react";

export const animations = {
  pulse: `${keyframes({
    "0%": { opacity: 1 },
    "50%": { opacity: 0.5 },
    "100%": { opacity: 1 }
  })} 1s ease infinite`
};
