import { ReactNode } from "react";
import { BoxProps, Button, Flex, HStack } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Icon } from "./Icon";
import { Typography } from "./Typography";

export type RateProps = ComponentProps<
  BoxProps,
  {
    title?: ReactNode;
    isDisabled?: boolean;
    onClick?: (value: number) => void;
  }
>;

export function Rate({ title, isDisabled, onClick, ...props }: RateProps) {
  const handleClick = (index: number) => {
    onClick?.(index + 1);
  };

  let _title;
  if (title) {
    _title = (
      <Typography as="h4" fontSize="md" fontWeight="semibold" lineHeight="6">
        {title}
      </Typography>
    );
  }

  return (
    <Flex flexDirection="column" alignItems="flex-start" justifyContent="flex-start" {...props}>
      {_title}

      <HStack display="flex" alignItems="center" justifyContent="flex-start" spacing="1.5" mt="2">
        {Array.from(Array(5).keys()).map((i) => (
          <Button
            key={i}
            type="button"
            variant="outline"
            isDisabled={isDisabled}
            onClick={() => handleClick(i)}
          >
            <Icon name="regular.faStar" w="3.5" />
          </Button>
        ))}
      </HStack>
    </Flex>
  );
}
