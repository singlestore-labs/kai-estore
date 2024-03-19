import { ComponentType, forwardRef, memo, useId } from "react";
import {
  Box,
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
  FormHelperText,
  FormHelperTextProps,
  FormLabel,
  FormLabelProps,
  Input,
  InputProps
} from "@chakra-ui/react";

import { Defined } from "@/types/helpers";
import { ComponentProps } from "@/types/common";

import { Select, SelectProps } from "./Select";

type ElementKeysInherit = "name" | "value" | "onChange";
type ElementKeysInheritOptional = "type" | "placeholder" | "onFocus" | "onBlur";

type InheritElementProps<T extends { [K in PropertyKey]: any }> = Pick<T, ElementKeysInherit> &
  Partial<Pick<T, ElementKeysInheritOptional>> & {
    controlProps?: Omit<T, ElementKeysInherit | ElementKeysInheritOptional>;
  };

export type FieldPropsByElement =
  | ({ element?: "input" } & InheritElementProps<InputProps>)
  | ({ element?: "select" } & InheritElementProps<SelectProps>)
  | ({ element?: "checkbox" } & InheritElementProps<CheckboxProps>);

export type FieldElements = Defined<FieldPropsByElement["element"]>;

export type FieldProps = ComponentProps<
  FormControlProps,
  {
    label?: FormLabelProps["children"] | false;
    labelProps?: Omit<FormLabelProps, "children" | "htmlFor">;
    error?: FormErrorMessageProps["children"];
    message?: FormHelperTextProps["children"];
    messageProps?: Omit<FormHelperTextProps, "children">;
  } & Omit<FieldPropsByElement, "as">
>;

const componentsByElement: Record<FieldElements, ComponentType<any>> = {
  input: Input,
  select: Select,
  checkbox: Checkbox
};

const FieldComponent = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      children,
      element = "input",
      type,
      id,
      name,
      value,
      placeholder,
      label: initialLabel,
      labelProps,
      controlProps,
      message,
      messageProps,
      error,
      isInvalid,
      onChange,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const initialId = useId();
    const _id = id || initialId;
    const _isInvalid = isInvalid || !!error;
    const label = initialLabel !== false ? initialLabel || name : undefined;
    const Component = componentsByElement[element];

    if (!Component) return null;

    let _label;
    if (label) {
      _label = (
        <FormLabel
          display="block"
          fontSize="xs"
          lineHeight="4"
          fontWeight="semibold"
          mb="1"
          {...labelProps}
          htmlFor={_id}
          _firstLetter={{ textTransform: "uppercase" }}
        >
          {label}
        </FormLabel>
      );
    }

    let _message;
    if (message) {
      _message = (
        <FormHelperText
          display="block"
          _firstLetter={{ textTransform: "uppercase" }}
          {...messageProps}
        >
          {message}
        </FormHelperText>
      );
    }

    let _error;
    if (error) {
      _error = (
        <FormErrorMessage
          display="block"
          color="s2.red.500"
          fontSize="xs"
          fontWeight="500"
          _firstLetter={{ textTransform: "uppercase" }}
        >
          {error}
        </FormErrorMessage>
      );
    }

    return (
      <FormControl
        {...props}
        as="div"
        ref={ref}
        isInvalid={_isInvalid}
      >
        {_label}

        <Box position="relative">
          <Component
            {...controlProps}
            type={type}
            id={_id}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {children}
        </Box>

        {_message}
        {_error}
      </FormControl>
    );
  }
);

FieldComponent.displayName = "Field";

export const Field = memo(FieldComponent);
