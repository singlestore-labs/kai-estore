import { ChakraProps, chakra } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as FaIconsRegular from "@fortawesome/free-regular-svg-icons";
import * as FaIconsSolid from "@fortawesome/free-solid-svg-icons";

import { ComponentProps } from "@/types/common";

import IconGitHub from "@/assets/icons/GitHub.svg";
import IconTwitter from "@/assets/icons/Twitter.svg";
import IconLinkedIn from "@/assets/icons/LinkedIn.svg";

export type IconProps = ComponentProps<
  ChakraProps,
  {
    name:
      | `regular.${keyof typeof FaIconsRegular}`
      | `solid.${keyof typeof FaIconsSolid}`
      | `social.${keyof typeof iconsSocial}`;
  }
>;

const iconsSocial = { github: IconGitHub, twitter: IconTwitter, linkedin: IconLinkedIn } as const;

const icons = {
  regular: FaIconsRegular,
  solid: FaIconsSolid,
  social: iconsSocial
};

export function Icon({ name, ...props }: IconProps) {
  const [prefix, _name] = name.split(".");
  const icon = (icons[prefix as keyof typeof icons] as any)[_name];

  if (prefix === "social") {
    const Icon = chakra(icon);
    return <Icon {...props} />;
  }

  const Icon = chakra(FontAwesomeIcon);

  return (
    <Icon
      {...props}
      icon={icon}
    />
  );
}
