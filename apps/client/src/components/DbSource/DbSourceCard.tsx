import { ChakraProps } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";
import { Defined } from "@/types/helpers";

import { StatCard, StatCardProps } from "@/components/common/StatCard";
import { Typography, TypographyProps } from "@/components/common/Typography";
import { Logo, LogoProps } from "@/components/Logo";

type SpeedometerProps = Pick<Defined<StatCardProps["speedometers"]>[number], "value" | "displayValue">;

export type DbSourceCardProps = ComponentProps<
  StatCardProps,
  {
    name: string;
    title?: TypographyProps["children"];
    subtitle?: TypographyProps["children"];
    subtitlePrefix?: TypographyProps["children"];
    logo?: LogoProps["variant"];
    primaryColor?: ChakraProps["color"];
    secondaryColor?: ChakraProps["color"];
    recomm?: SpeedometerProps;
    queryTime?: SpeedometerProps;
    isActive?: boolean;
  }
>;

export function DbSourceCard({
  title,
  subtitle,
  subtitlePrefix,
  logo,
  primaryColor = "s2.purple.300",
  secondaryColor = "s2.purple.800",
  recomm,
  queryTime,
  isActive,
  isLoading,
  isDisabled,
  ...props
}: DbSourceCardProps) {
  let _title;
  if (title || logo) {
    let _logo;
    if (logo) {
      _logo = (
        <Logo
          variant={logo}
          color="currentcolor"
          mr="2"
        />
      );
    }

    _title = (
      <Typography
        as="span"
        display="inline-flex"
        alignItems="center"
        justifyContent="flex-start"
      >
        {_logo}
        {title}
      </Typography>
    );
  }

  let _subtitle;
  if (isActive && (subtitle || subtitlePrefix)) {
    let _prefix;
    if (subtitlePrefix) {
      _prefix = (
        <Typography
          as="span"
          fontSize="2xl"
          textDecoration="underline"
        >
          {subtitlePrefix}
        </Typography>
      );
    }

    let _text;
    if (subtitle) {
      _text = <Typography as="span">{subtitle}</Typography>;
    }

    _subtitle = (
      <Typography
        as="span"
        display="flex"
        alignItems="baseline"
        gap="1"
      >
        {_prefix}
        {_text}
      </Typography>
    );
  }

  const speedometers = [
    { value: 0, ...recomm, title: "Recommendations" },
    { value: 0, ...queryTime, title: "Query Time" }
  ];

  return (
    <StatCard
      variant="2"
      w="full"
      h="full"
      {...props}
      primaryColor={primaryColor}
      title={_title}
      subtitle={!isDisabled ? _subtitle : undefined}
      speedometers={speedometers}
      footerProps={{ bg: secondaryColor, ...props.footerProps }}
      isLoading={isLoading}
      isDisabled={isDisabled}
    />
  );
}
