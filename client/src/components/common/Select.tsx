import { ReactNode } from "react";
import { Select as ChakraSelect, SelectProps as ChakraSelectProps } from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

export type SelectOption = {
  label?: ReactNode;
  value: string | number;
};

export type SelectProps = ComponentProps<
  ChakraSelectProps,
  {
    options?: SelectOption[];
  }
>;

export function Select({ options, ...props }: SelectProps) {
  return (
    <ChakraSelect {...props}>
      {options?.map((option) => (
        <option key={option.value} value={option?.value}>
          {option?.label}
        </option>
      ))}
    </ChakraSelect>
  );
}
