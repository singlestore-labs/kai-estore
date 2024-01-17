import { forwardRef } from "react";
import { Text, TextProps, Heading, HeadingProps } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

const HEADING_ELEMENTS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

type HeadingElements = (typeof HEADING_ELEMENTS)[number];

export type TypographyProps = ComponentProps<
  | ({ as?: Exclude<TextProps["as"], HeadingElements> } & Omit<TextProps, "as">)
  | ({ as?: Extract<HeadingProps["as"], HeadingElements> } & Omit<HeadingProps, "as">)
>;

export const Typography = forwardRef<any, TypographyProps>(({ as: element = "span", ...props }, ref) => {
  const Component = HEADING_ELEMENTS.includes(element as HeadingElements) ? Heading : Text;

  return <Component {...props} as={element} ref={ref} />;
});

Typography.displayName = "Typography";
