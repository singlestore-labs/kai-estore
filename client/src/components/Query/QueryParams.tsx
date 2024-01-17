import { useMemo } from "react";
import omit from "lodash.omit";
import * as Yup from "yup";

import { ComponentProps } from "@/types/common";

import { Section, SectionProps } from "@/components/common/Section";
import { Form, FormProps } from "@/components/common/Form";
import { Field, FieldProps } from "@/components/common/Field";

export type QueryParamsProps = ComponentProps<
  Omit<SectionProps, "children">,
  {
    fields?: Record<string, FieldProps>;
    validationSchema?: Yup.AnySchema;
    formProps?: Omit<FormProps, "children" | "initialValues" | "onSubmit">;
    isLoading?: boolean;
    onChange?: FormProps["onChange"];
  }
>;

export const QueryParams = ({
  fields,
  validationSchema,
  formProps,
  isLoading,
  onChange,
  ...props
}: QueryParamsProps) => {
  const fieldsEntries = useMemo(() => Object.entries(fields ?? {}), [fields]);

  const initialValues: FormProps["initialValues"] = useMemo(() => {
    if (!fieldsEntries) return {};

    return fieldsEntries.reduce((values, [key, field]) => {
      return { ...values, [key]: field.value ?? "" };
    }, {});
  }, [fieldsEntries]);

  const _fields: FormProps["children"] = useMemo(() => {
    if (!fieldsEntries) return () => null;

    return (formik) => {
      return fieldsEntries.map(([name, field]) => {
        return (
          <Field
            {...omit(field, "validationSchema")}
            key={name}
            name={name}
            value={formik.values[name]}
            error={formik.errors[name] as string}
            controlProps={{ variant: "outline", size: "s2.md" }}
            onChange={formik.handleChange}
            isDisabled={isLoading}
          />
        );
      });
    };
  }, [fieldsEntries, isLoading]);

  return (
    <Section
      title="Parameters"
      w="full"
      maxW="full"
      p="0"
      {...props}
      titleProps={{ fontSize: "sm", lineHeight: "5", fontWeight: "semibold", ...props.titleProps }}
      headerProps={{ mb: "2", ...props.headerProps }}
      containerProps={{ p: "0", ...props.containerProps }}
    >
      <Form
        formProps={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
          gap: "3",
          rowGap: "3",
          flexWrap: "wrap",
          ...formProps,
        }}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onChange={onChange}
      >
        {_fields}
      </Form>
    </Section>
  );
};
