import { ReactNode } from "react";
import { VStack } from "@chakra-ui/react";
import * as Yup from "yup";

import { ComponentProps } from "@/types/common";
import { ConnectionConfig } from "@/types/api";
import { Form, FormProps } from "./common/Form";
import { Field, FieldProps } from "./common/Field";

export type ConfigurationFormProps = ComponentProps<
  Omit<FormProps, "children" | "initialValues">,
  {
    children?: ReactNode;
    variant?: "light" | "dark";
    initialValues?: ConnectionConfig;
    isDisabled?: boolean;
  }
>;

const defaultInitialValues: ConnectionConfig = {
  mongoURI: "",
  dbName: "",
  dataSize: "s",
  shouldGenerateData: false,
};

const labelProps: FieldProps["labelProps"] = {
  fontSize: "sm",
  textTransform: "uppercase",
  mb: "1.5",
};

const formValidationSchema = Yup.object({
  mongoURI: Yup.string().label("Mongo URI").required(),
  dbName: Yup.string().label("Database name").required(),
  dataSize: Yup.string().label("Dataset size").required(),
  shouldGenerateData: Yup.bool(),
});

export function ConfigurationForm({
  children,
  variant = "light",
  initialValues,
  isDisabled = false,
  onSubmit,
  ...props
}: ConfigurationFormProps) {
  return (
    <Form
      {...props}
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      validationSchema={formValidationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <VStack spacing="3">
          <Field
            name="mongoURI"
            label="Connection String"
            message="To connect to a database instance using the MongoDB® API, provide the connection string to the client after replacing the username and password."
            placeholder="mongodb://user:password@host"
            value={formik.values.mongoURI}
            error={formik.touched.mongoURI && (formik.errors.mongoURI as string)}
            labelProps={labelProps}
            messageProps={{ color: "inherit" }}
            controlProps={{ variant: variant === "light" ? "filled" : "outline" }}
            onChange={formik.handleChange}
            isDisabled={isDisabled}
          />
          <Field
            name="dbName"
            label="Database"
            placeholder="eStore"
            value={formik.values.dbName}
            error={formik.touched.dbName && (formik.errors.dbName as string)}
            labelProps={labelProps}
            controlProps={{ variant: variant === "light" ? "filled" : "outline" }}
            onChange={formik.handleChange}
            isDisabled={isDisabled}
          />

          <Field
            element="checkbox"
            controlProps={{ children: "Generate data", isChecked: formik.values.shouldGenerateData }}
            onChange={(e: any) => formik.setFieldValue("shouldGenerateData", e.target.checked)}
          />

          {formik.values.shouldGenerateData && (
            <Field
              name="dataSize"
              element="select"
              label="Size"
              value={formik.values.dataSize}
              error={formik.touched.dataSize && (formik.errors.dataSize as string)}
              labelProps={labelProps}
              controlProps={{
                options: [
                  { label: "Select size", value: "" },
                  { label: "Small", value: "s" },
                  { label: "Medium", value: "m" },
                  { label: "Large", value: "l" },
                ],
                variant: variant === "light" ? "filled" : "outline",
              }}
              onChange={formik.handleChange}
              isDisabled={isDisabled}
            />
          )}
          {children}
        </VStack>
      )}
    </Form>
  );
}
