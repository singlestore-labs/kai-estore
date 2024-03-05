import React, { useRef } from "react";
import { Box, BoxProps, ChakraProps } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { useResizeObserver } from "@/hooks/useResizeObserver";
import { animations } from "@/theme/animations";

import { Typography, TypographyProps } from "./Typography";

export type SpeedometerProps = ComponentProps<
  Omit<BoxProps, "maxW">,
  {
    value?: number;
    displayValue?: TypographyProps["children"];
    displayValueProps?: Omit<TypographyProps, "children">;
    unit?: string;
    secondaryColor?: ChakraProps["color"];
    arcWrapperProps?: BoxProps;
    strokeProps?: React.ComponentProps<typeof Arc> & { [K: string]: any };
    isLoading?: boolean;
  }
>;

const arcLimit = 100;
const arcDashArray = 200;

function calcDisplayValueFontSize(targetWidth: number) {
  return `${targetWidth / 92}rem`;
}

export function Speedometer({
  value = 0,
  displayValue,
  displayValueProps,
  unit,
  secondaryColor = "s2.gray.800",
  arcWrapperProps,
  strokeProps,
  isLoading = false,
  ...props
}: SpeedometerProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const displayValueRef = useRef<HTMLSpanElement>(null);

  useResizeObserver(rootRef, () => {
    if (!rootRef.current || !displayValueRef.current) return;
    displayValueRef.current.style.fontSize = calcDisplayValueFontSize(rootRef.current?.clientWidth);
  });

  let arcDashOffset = arcDashArray - (arcDashArray / 100) * (arcLimit / 100) * value;
  if (isNaN(arcDashOffset)) arcDashOffset = 0;

  if (arcDashOffset > arcDashArray) {
    arcDashOffset = arcDashArray;
  } else if (arcDashOffset < 0) {
    arcDashOffset = 0;
  }

  let _displayValue;
  if (displayValue) {
    _displayValue = (
      <Typography
        as="span"
        fontSize="2xl"
        lineHeight="1"
        fontWeight="semibold"
        position="absolute"
        left="50%"
        bottom="0"
        transform="translateX(-50%)"
        color="white"
        {...displayValueProps}
        ref={displayValueRef}
      >{`${displayValue}${unit ?? ""}`}</Typography>
    );
  }

  return (
    <Box
      position="relative"
      w="full"
      h="auto"
      overflow="hidden"
      color="s2.purple.800"
      {...props}
      maxW="full"
      ref={rootRef}
      _after={{ content: "''", display: "block", w: "full", pt: "55.714287%", ...props._after }}
    >
      <Box
        animation={isLoading ? animations.pulse : ""}
        {...arcWrapperProps}
      >
        <Arc
          color="currentcolor"
          strokeProps={{ strokeDasharray: arcDashArray, strokeDashoffset: arcDashOffset, ...strokeProps }}
          zIndex="1"
        />
        <Arc
          color={secondaryColor}
          strokeProps={strokeProps}
        />
        {_displayValue}
      </Box>
    </Box>
  );
}

function Arc({
  strokeProps,
  ...props
}: BoxProps & {
  strokeProps?: BoxProps & { strokeDasharray?: string | number; strokeDashoffset?: string | number };
}) {
  return (
    <Box
      as="svg"
      position="absolute"
      top="0"
      left="0"
      w="full"
      h="full"
      color="s2.gray.800"
      fill="none"
      transition="all 0.6s ease, color 0s"
      {...props}
      viewBox="0 0 140 78"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Box
        as="path"
        d="M7.5 70.4712C7.5 53.7626 14.0848 37.7383 25.8058 25.9235C37.5269 14.1087 53.424 7.47119 70 7.47119C86.576 7.47119 102.473 14.1087 114.194 25.9235C125.915 37.7383 132.5 53.7626 132.5 70.4712"
        stroke="currentcolor"
        strokeWidth="14"
        strokeLinecap="round"
        transition="inherit"
        {...strokeProps}
      />
    </Box>
  );
}
