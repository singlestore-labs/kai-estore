import { ReactNode, useState } from "react";
import { Button, VStack } from "@chakra-ui/react";
import * as Yup from "yup";

import { ComponentProps } from "@/types/common";
import { ConnectionConfig } from "@/types/api";
import { Form, FormProps } from "../common/Form";
import { Field, FieldProps } from "../common/Field";
import { Icon } from "@/components/common/Icon";

export type ConfigurationFormProps = ComponentProps<
  Omit<FormProps, "children" | "initialValues">,
  {
    children?: ReactNode;
    variant?: "light" | "dark";
    initialValues?: Partial<ConnectionConfig>;
    isDisabled?: boolean;
    withDataGeneration?: boolean;
  }
>;

const defaultInitialValues: ConnectionConfig = {
  mongoURI: "",
  dbName: "kai_estore",
  dataSize: "s",
  shouldGenerateData: false,
  withCDC: false
};

const labelProps: FieldProps["labelProps"] = {
  fontSize: "sm",
  textTransform: "uppercase",
  mb: "1.5"
};

const formValidationSchema = Yup.object({
  mongoURI: Yup.string().label("Mongo URI").required(),
  dbName: Yup.string().label("Database name").optional(),
  dataSize: Yup.string().label("Dataset size"),
  shouldGenerateData: Yup.bool(),
  withCDC: Yup.bool()
});

export function ConfigurationForm({
  children,
  variant = "light",
  initialValues,
  isDisabled = false,
  withDataGeneration = false,
  onSubmit,
  ...props
}: ConfigurationFormProps) {
  const [isURIVisible, setIsURIVisible] = useState(false);

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
            type={isURIVisible ? "text" : "password"}
            name="mongoURI"
            label="Connection String"
            message="Make sure you include the username and password in the connection string."
            placeholder="mongodb://user:password@host"
            value={formik.values.mongoURI}
            error={formik.touched.mongoURI && (formik.errors.mongoURI as string)}
            labelProps={labelProps}
            messageProps={{ color: "inherit" }}
            controlProps={{ variant: variant === "light" ? "filled" : "outline", pr: "8" }}
            onChange={formik.handleChange}
            isDisabled={isDisabled}
          >
            <Button
              position="absolute"
              top="50%"
              right="2"
              transform="translateY(-50%)"
              color="s2.gray.600"
              bg="transparent"
              p="0"
              w="5"
              h="auto"
              minH="auto"
              minW="auto"
              _hover={{ bg: "transparent", color: "white" }}
              onClick={() => setIsURIVisible((i) => !i)}
              zIndex="1"
            >
              <Icon
                w="full"
                h="auto"
                name={isURIVisible ? "solid.faEye" : "solid.faEyeSlash"}
              />
            </Button>
          </Field>
          <Field
            name="dbName"
            label="Database"
            message="Provide the name of the database to replicate data from MongoDB."
            placeholder="eStore"
            value={formik.values.dbName}
            error={formik.touched.dbName && (formik.errors.dbName as string)}
            labelProps={labelProps}
            messageProps={{ color: "inherit" }}
            controlProps={{ variant: variant === "light" ? "filled" : "outline" }}
            onChange={formik.handleChange}
            isDisabled={isDisabled}
          />

          {withDataGeneration && (
            <Field
              element="checkbox"
              controlProps={{ children: "Generate data", isChecked: formik.values.shouldGenerateData }}
              onChange={(e: any) => formik.setFieldValue("shouldGenerateData", e.target.checked)}
            />
          )}

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
                  { label: "Large", value: "l" }
                ],
                variant: variant === "light" ? "filled" : "outline"
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
