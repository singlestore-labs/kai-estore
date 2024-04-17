import { Link } from "@/components/common/Link";
import { Typography } from "@/components/common/Typography";
import { ROUTES } from "@/constants/routes";
import { useIsConnectionExist } from "@/state/connection";
import { ComponentProps } from "@/types/common";
import { Box, BoxProps, keyframes } from "@chakra-ui/react";
import { MutableRefObject, useEffect, useRef, useState } from "react";

export type ActiveClusterWidgetProps = ComponentProps<BoxProps, { hideOnRef?: MutableRefObject<any> }>;

const animationIn = keyframes({
  "0%": {
    transform: "translate(50%, 50%)",
    opacity: 0,
    visibility: "hidden"
  },

  "100%": {
    transform: "translate(50%, 0)",
    opacity: 1,
    visibility: "visible"
  }
});

const animationOut = keyframes({
  "0%": {
    transform: "translate(50%, 0)",
    opacity: 1,
    visibility: "visible"
  },
  "100%": {
    transform: "translate(50%, 50%)",
    opacity: 0,
    visibility: "hidden"
  }
});

const checkOverlap = (...elements: (HTMLElement | undefined)[]) => {
  const rects = elements.filter(Boolean).map((element) => element!.getBoundingClientRect());
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      if (
        !(
          rects[j].left > rects[i].right ||
          rects[j].right < rects[i].left ||
          rects[j].top > rects[i].bottom ||
          rects[j].bottom < rects[i].top
        )
      ) {
        return true;
      }
    }
  }
  return false;
};

export function ActiveClusterWidget({ hideOnRef, ...props }: ActiveClusterWidgetProps) {
  const rootRef = useRef<HTMLDivElement>();
  const _hideOnRef = useRef(hideOnRef);
  const isConnectionExist = useIsConnectionExist();
  const [isIn, setIsIn] = useState(true);

  useEffect(() => {
    const listener: Parameters<typeof window.addEventListener>[1] = () => {
      setIsIn(!checkOverlap(rootRef.current, _hideOnRef?.current?.current));
    };
    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  }, []);

  return (
    <Box
      position="fixed"
      bottom="4"
      right="50%"
      color="white"
      bg="s2.misc.2"
      px="4"
      py="3"
      pb="4"
      rounded="6"
      animation={`${isIn ? animationIn : animationOut} 0.4s ease-out forwards`}
      display="flex"
      flexDirection="column"
      maxW="calc(100%-96px)"
      textAlign="center"
      gap="2"
      fontSize="xs"
      {...props}
      ref={rootRef}
    >
      <Typography fontWeight="medium">Demo application is running on a MongoDB® Atlas M40 cluster.</Typography>
      {!isConnectionExist ? (
        <Link
          href={`${ROUTES.analytics}?modalOpen=1`}
          chakra={{
            variant: "outline.secondary",
            color: "white",
            size: "s2.xs",
            _hover: { color: "black", bg: "white" }
          }}
        >
          Get 100x faster analytics with SingleStore Kai™
        </Link>
      ) : (
        <Link
          href={ROUTES.analytics}
          chakra={{
            variant: "outline.secondary",
            color: "white",
            size: "s2.xs",
            _hover: { color: "black", bg: "white" }
          }}
        >
          Explore analytics
        </Link>
      )}
    </Box>
  );
}
