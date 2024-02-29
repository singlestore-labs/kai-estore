import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AccordionProps,
  Checkbox,
  CheckboxGroup,
  CheckboxGroupProps,
  Stack
} from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";
import { Defined } from "@/types/helpers";

import { Typography } from "./Typography";

export type InputCheckboxAccordionOption = {
  label: string;
  value: string | number;
};

export type InputCheckboxAccordionProps = ComponentProps<
  AccordionProps,
  {
    title?: string;
    options: InputCheckboxAccordionOption[];
    value?: InputCheckboxAccordionOption["value"][];
    defaultValue?: CheckboxGroupProps["defaultValue"];
    isCollapsed?: number;
    onChange?: CheckboxGroupProps["onChange"];
  }
>;

export function InputCheckboxAccordion({
  title,
  options,
  value,
  defaultValue,
  isCollapsed: initialIsCollapsed = 0,
  onChange,
  ...props
}: InputCheckboxAccordionProps) {
  const [checkedNumber, setCheckedNumber] = useState(defaultValue?.length ?? 0);
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed);

  const handleChange: Defined<CheckboxGroupProps["onChange"]> = (value) => {
    setCheckedNumber(value.length);
    onChange?.(value);
  };

  let _title;
  if (title) {
    _title = (
      <Typography
        as="span"
        fontSize="md"
        fontWeight="semibold"
        lineHeight="6"
      >
        {`${title}${checkedNumber > 0 ? ` (${checkedNumber})` : ""}`}
      </Typography>
    );
  }

  const checkboxes = useMemo(() => {
    return options.map((option) => (
      <Checkbox
        key={option.value}
        value={option.value}
      >
        {option.label}
      </Checkbox>
    ));
  }, [options]);

  return (
    <Accordion
      allowToggle
      {...props}
      defaultIndex={[isCollapsed]}
    >
      <AccordionItem>
        <h4>
          <AccordionButton
            justifyContent="space-between"
            onClick={() => setIsCollapsed((int) => (int === 0 ? 1 : 0))}
          >
            {_title}
            <AccordionIcon />
          </AccordionButton>
        </h4>
        <AccordionPanel>
          <CheckboxGroup
            defaultValue={defaultValue}
            value={value}
            onChange={handleChange}
            size="lg"
            variant="1"
          >
            <Stack
              direction="column"
              spacing="2.5"
            >
              {checkboxes}
            </Stack>
          </CheckboxGroup>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
