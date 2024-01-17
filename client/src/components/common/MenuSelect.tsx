import { Fragment, ReactNode, useCallback, useEffect, useState } from "react";
import {
  Button,
  ButtonProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuListProps,
  MenuProps,
  forwardRef,
} from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Icon } from "./Icon";
import { Typography } from "./Typography";

export type MenuSelectOption = { label: string; value: string };

export type MenuSelectProps = ComponentProps<
  Omit<MenuProps, "children">,
  {
    title?: string;
    value?: MenuSelectOption["value"];
    options?: MenuSelectOption[];
    onChange?: (value: MenuSelectOption["value"]) => void;
    listProps?: MenuListProps;
  }
>;

const Toggler = forwardRef<ButtonProps & { isOpen?: boolean }, "button">(({ ...props }, ref) => {
  return (
    <Button
      variant="none"
      rightIcon={<Icon name="solid.faChevronDown" w="3" />}
      textAlign="right"
      justifyContent="flex-end"
      borderRadius="0"
      borderColor={"gray.200"}
      px="0"
      {...props}
      ref={ref}
      position="relative"
    />
  );
});

Toggler.displayName = "MenuSelect.Toggler";

export function MenuSelect({ title, value, options, onChange, listProps, ...props }: MenuSelectProps) {
  const findIndex = useCallback(() => {
    return options?.findIndex((option) => option.value === value) ?? 0;
  }, [options, value]);

  const [valueIndex, setValueIndex] = useState(findIndex);
  const optionLabel = options?.[valueIndex]?.label;

  useEffect(() => {
    setValueIndex(findIndex);
  }, [findIndex]);

  let label: ReactNode;
  if (optionLabel) {
    label = (
      <Typography as="span" fontWeight="normal">
        {optionLabel}
      </Typography>
    );
  }

  const handleOptionClick = (option: MenuSelectOption) => {
    setValueIndex((index) => options?.indexOf(option) ?? index);
    onChange?.(option.value);
  };

  const _options = options?.map((option, i) => {
    const isActive = i === valueIndex;

    return (
      <MenuItem
        key={option.value}
        onClick={() => handleOptionClick(option)}
        color={isActive ? "s2.gray.500" : ""}
        _hover={isActive ? { bg: "transparent" } : { bg: "s2.gray.200" }}
      >
        {option.label}
      </MenuItem>
    );
  });

  return (
    <Menu variant="1" {...props}>
      {() => (
        <Fragment>
          <MenuButton as={Toggler}>
            <Typography as="span" fontSize="md" lineHeight="6" fontWeight="semibold">
              {`${title ?? ""}${optionLabel ? ": " : ""}`}
              {label}
            </Typography>
          </MenuButton>
          <MenuList transition="0" borderRadius="0" minW="fit-content" {...listProps}>
            {_options}
          </MenuList>
        </Fragment>
      )}
    </Menu>
  );
}
