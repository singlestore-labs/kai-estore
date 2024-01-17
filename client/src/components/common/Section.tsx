import { ReactNode } from "react";
import { Box, BoxProps, Container, ContainerProps, forwardRef } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Typography, TypographyProps } from "./Typography";
import { Loader } from "./Loader";

import { createVariantsProps } from "@/utils/helpers";

export type SectionVariants = "1" | "2" | "3" | "3.solid";

export type SectionProps = ComponentProps<
  BoxProps,
  {
    title?: TypographyProps["children"];
    titleProps?: Omit<TypographyProps, "children">;
    description?: TypographyProps["children"];
    descriptionProps?: Omit<TypographyProps, "children">;
    containerProps?: ContainerProps;
    headerChildren?: ReactNode;
    headerProps?: Omit<BoxProps, "children">;
    bodyProps?: Omit<BoxProps, "children">;
    variant?: SectionVariants;
    isLoading?: boolean;
  }
>;

const variantsProps = createVariantsProps<SectionVariants>(() => ({
  "1": {
    section: {
      pt: "6",
    },

    header: {
      mb: "3",
    },

    title: {
      fontSize: "xl",
    },

    description: {
      fontSize: "md",
      fontWeight: "normal",
      mt: "3",
    },
  },

  "2": {
    header: {
      mb: "6",
    },

    title: {
      fontSize: "2xl",
    },

    description: {
      mt: "3",
    },
  },

  "3": {
    section: {
      bg: "whiteAlpha.100",
      borderTopRadius: "lg",
      overflow: "hidden",
    },

    container: {
      px: "0",
    },

    header: {
      bg: "whiteAlpha.100",
      borderRadius: "lg",
      px: "6",
      py: "3",
    },

    title: {
      fontSize: "md",
      lineHeight: "6",
    },
    body: {
      p: "6",
    },
  },

  "3.solid": {
    section: {
      bg: "whiteAlpha.100",
      borderRadius: "lg",
      overflow: "hidden",
    },

    container: {
      px: "0",
    },

    header: {
      p: "6",
    },

    title: {
      fontSize: "md",
      lineHeight: "6",
    },

    body: {
      p: "6",
      pt: "0",
    },
  },
}));

export const Section = forwardRef<SectionProps, "section">(
  (
    {
      children,
      title,
      titleProps,
      description,
      descriptionProps,
      containerProps,
      headerChildren,
      headerProps,
      bodyProps,
      variant = "1",
      isLoading = false,
      ...props
    },
    ref,
  ) => {
    const variantProps = variantsProps()[variant];

    let _title;
    if (title) {
      _title = (
        <Typography as="h2" {...variantProps.title} {...titleProps}>
          {title}
        </Typography>
      );
    }

    let _description;
    if (description) {
      _description = (
        <Typography as="p" {...variantProps.description} {...descriptionProps}>
          {description}
        </Typography>
      );
    }

    return (
      <Box {...variantProps.section} {...props} as="section" ref={ref}>
        <Container size="s2.xl" position="relative" {...variantProps.container} {...containerProps}>
          <Box {...variantProps.header} {...headerProps}>
            {_title}
            {_description}
            {headerChildren}
          </Box>
          <Box position="relative" {...variantProps.body} {...bodyProps}>
            <Loader isOpen={isLoading} />
            {children}
          </Box>
        </Container>
      </Box>
    );
  },
);
