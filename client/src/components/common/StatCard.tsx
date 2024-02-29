import { Fragment } from "react";
import { Box, BoxProps, ChakraProps, Flex, FlexProps } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Typography, TypographyProps } from "./Typography";
import { Speedometer, SpeedometerProps } from "./Speedometer";
import { Loader, LoaderProps } from "./Loader";

import { createVariantsProps } from "@/utils/helpers";

export type StatCardVariants = "1" | "2";

export type StatCardProps = ComponentProps<
  FlexProps,
  {
    title?: TypographyProps["children"];
    titleProps?: Omit<TypographyProps, "children">;
    subtitle?: TypographyProps["children"];
    subtitleProps?: Omit<TypographyProps, "children">;
    speedometers?: (SpeedometerProps & {
      title?: TypographyProps["children"];
      titleProps?: Omit<TypographyProps, "children">;
    })[];
    primaryColor?: ChakraProps["color"];
    secondaryColor?: ChakraProps["color"];
    titleColor?: ChakraProps["color"];
    variant?: StatCardVariants;
    headerProps?: Omit<BoxProps, "children">;
    headerChildren?: BoxProps["children"];
    footerProps?: Omit<BoxProps, "children">;
    footerChildren?: BoxProps["children"];
    loaderProps?: LoaderProps;
    isDisabled?: boolean;
    isLoading?: boolean;
  }
>;

const variantsProps = createVariantsProps<StatCardVariants>((props) => ({
  "1": {
    card: {
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "8",
      p: "6",
    },

    content: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },

    title: {
      fontSize: "sm",
      fontWeight: "medium",
      lineHeight: "5",
      color: props.isDisabled ? props.bg : props.titleColor || props.secondaryColor,
      bg: props.primaryColor,
      borderRadius: "md",
      py: "0.5",
      px: "2",
    },

    subtitle: {
      display: "block",
      fontSize: "xs",
      lineHeight: "4",
      fontWeight: "semibold",
      color: props.color,
      mt: "1",
    },

    loader: {
      color: props.initialPrimaryColor,
    },

    speedometer: {
      color: props.primaryColor,
      secondaryColor: props.secondaryColor,
      displayValueProps: { color: props.color },
    },
  },

  "2": {
    card: {
      display: "flex",
      flexDirection: "column",
      pb: "0",
      transition: "0.4s ease",
    },

    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      p: "4",
      borderBottom: "1px",
    },

    title: {
      fontSize: "md",
      lineHeight: "6",
      fontWeight: "medium",
    },

    speedometers: {
      p: "6",
    },

    speedometer: {
      color: props.primaryColor,
      secondaryColor: props.secondaryColor,
      displayValueProps: { color: props.color },
    },

    footer: {
      display: "grid",
      alignItems: "center",
      justifyContent: "center",
      bg: "s2.gray.800",
      mt: "auto",
      overflow: "hidden",
      transition: "0.4s ease",

      ...(props.subtitle
        ? {
            gridTemplateRows: "1fr",
            px: "4",
            pt: "2",
            pb: "3",
          }
        : {
            gridTemplateRows: "0fr",
            p: "0",
          }),
    },

    subtitle: {
      fontSize: "md",
      lineHeight: "6",
      fontWeight: "semibold",
      overflow: "hidden",
    },
  },
}));

export function StatCard({
  title,
  titleProps,
  subtitle,
  subtitleProps,
  speedometers,
  color: initialColor = "white",
  primaryColor: initialPrimaryColor = "s2.gray.500",
  secondaryColor = "s2.gray.800",
  titleColor,
  bg = "s2.gray.900",
  variant = "1",
  headerProps,
  headerChildren,
  footerProps,
  footerChildren,
  loaderProps,
  isDisabled = false,
  isLoading = false,
  ...props
}: StatCardProps) {
  let color = initialColor;
  let primaryColor = initialPrimaryColor;

  if (isDisabled) {
    color = secondaryColor;
    primaryColor = color;
  }

  const variantProps = variantsProps({
    initialColor,
    color,
    initialPrimaryColor,
    primaryColor,
    secondaryColor,
    titleColor: titleColor || secondaryColor,
    bg,
    subtitle,
    isLoading,
    isDisabled,
  })[variant];

  let _title;
  if (title) {
    _title = (
      <Typography
        as="h4"
        display="inline-flex"
        alignItems="center"
        justifyContent="flex-start"
        {...variantProps.title}
        {...titleProps}
      >
        {title}
      </Typography>
    );
  }

  let _subtitle;
  if (subtitle) {
    _subtitle = (
      <Typography as="p" {...variantProps.subtitle} {...subtitleProps}>
        {subtitle}
      </Typography>
    );
  }

  let _speedometers;
  if (speedometers?.length) {
    _speedometers = (
      <Flex
        display="grid"
        alignItems="baseline"
        justifyContent="flex-start"
        gridTemplateColumns="repeat(auto-fit, minmax(8.75rem, 1fr))"
        gap="3"
        rowGap="6"
        {...variantProps.speedometers}
      >
        {speedometers.map((speedometer, i) => (
          <Box key={i} {...variantProps.speedometerWrapper}>
            <Speedometer {...variantProps.speedometer} {...speedometer} />
            {speedometer.title && (
              <Typography
                as="h6"
                textAlign="center"
                fontSize="xs"
                lineHeight="4"
                fontWeight="semibold"
                whiteSpace="break-spaces"
                overflowWrap="break-word"
                maxW="full"
                mt="2"
                {...speedometer.titleProps}
              >
                {speedometer.title}
              </Typography>
            )}
          </Box>
        ))}
      </Flex>
    );
  }

  let _body = (
    <Fragment>
      {_speedometers}
      <Flex {...variantProps.content}>
        {_title}
        {_subtitle}
      </Flex>
    </Fragment>
  );

  if (variant === "2") {
    const _footer = (
      <Box {...variantProps.footer} {...footerProps}>
        {_subtitle}
        {footerChildren}
      </Box>
    );

    _body = (
      <Fragment>
        <Box {...variantProps.header} {...headerProps}>
          {_title}
          {headerChildren}
        </Box>
        {_speedometers}
        {_footer}
      </Fragment>
    );
  }

  return (
    <Flex
      position="relative"
      w="full"
      maxW="full"
      color={color}
      bg={bg}
      overflow="hidden"
      border="2px"
      borderColor={isLoading ? "transparent" : primaryColor}
      borderRadius="lg"
      transition="0.4s ease"
      {...variantProps.card}
      {...props}
    >
      <Loader isOpen={isLoading} color={primaryColor} isDark {...variantProps.loader} {...loaderProps} />
      {_body}
    </Flex>
  );
}
