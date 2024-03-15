import { useEffect, useMemo, useRef, useState } from "react";
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
    isCollapsed?: boolean;
    onChange?: CheckboxGroupProps["onChange"];
  }
>;

export function InputCheckboxAccordion({
  title,
  options,
  value,
  defaultValue,
  isCollapsed: initialIsCollapsed = true,
  onChange,
  ...props
}: InputCheckboxAccordionProps) {
  const [checkedNumber, setCheckedNumber] = useState(defaultValue?.length ?? 0);
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed || !options.length);
  const prevOptionsLength = useRef(options.length);

  useEffect(() => {
    if (isCollapsed && options.length && prevOptionsLength.current !== options.length) {
      prevOptionsLength.current = options.length;
      setIsCollapsed(false);
    }
  }, [isCollapsed, options.length]);

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
    return options.map((option, i) => (
      <Checkbox
        key={`${option.value}${i}`}
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
      index={isCollapsed ? 1 : 0}
    >
      <AccordionItem>
        <h4>
          <AccordionButton
            justifyContent="space-between"
            onClick={() => setIsCollapsed((i) => !i)}
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
