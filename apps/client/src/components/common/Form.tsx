import { ComponentProps as ReactComponentProps, ReactNode, useEffect } from "react";
import { chakra, forwardRef } from "@chakra-ui/react";
import { FormikConfig, useFormik } from "formik";

import { ComponentProps } from "@/types/common";

type UseFormik = typeof useFormik;
type UseFormikReturn = ReturnType<UseFormik>;

export type FormPropsDefault = Omit<FormikConfig<any>, "children" | "onSubmit">;

export type FormProps = ComponentProps<
  FormPropsDefault,
  {
    id?: string;
    children: ReactNode | ((formik: UseFormikReturn) => ReactNode);
    onChange?: (values: UseFormikReturn["values"], isValid: UseFormikReturn["isValid"]) => void;
    onSubmit?: FormikConfig<any>["onSubmit"];
    formProps?: Omit<ReactComponentProps<(typeof chakra)["form"]>, keyof FormPropsDefault | "as" | "ref">;
  }
>;

export const Form = forwardRef<FormProps, "form">(
  ({ id, children, validationSchema, formProps, onChange, onSubmit, ...props }, ref) => {
    const formik = useFormik({
      ...props,
      validationSchema,
      onSubmit: (...args) => onSubmit?.(...args)
    });

    const _children = typeof children === "function" ? children(formik) : children;

    useEffect(() => {
      onChange?.(formik.values, formik.isValid);
    }, [formik.values, formik.isValid, onChange]);

    return (
      <chakra.form
        w="full"
        maxW="full"
        {...formProps}
        as="form"
        ref={ref}
        id={id}
        onSubmit={formik.handleSubmit}
      >
        {_children}
      </chakra.form>
    );
  }
);

Form.displayName = "Form";
