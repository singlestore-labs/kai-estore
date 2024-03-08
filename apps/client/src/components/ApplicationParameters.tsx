import { ReactNode, useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";

import { ApiParams, DbInfo } from "@/types/api";
import { ComponentProps } from "@/types/common";

import { Section, SectionProps } from "./common/Section";
import { Typography } from "./common/Typography";
import { Skeleton } from "./common/Skeleton";

import { api } from "@/api";
import { useTimeoutLoading } from "@/hooks/useTimeoutLoading";

export type ApplicationParametersProps = ComponentProps<
  SectionProps,
  {
    title?: ReactNode;
    connection?: ApiParams["connection"];
    isPlaceholder?: boolean;
  }
>;

function createParams(info?: DbInfo) {
  return {
    // "Data Size": info?.dbStats?.dataSize ? prettyBytes(info?.dbStats?.dataSize) : "Not ready",
    "Order Records": info?.orderRecords ?? undefined,
    "Products Number": info?.productsNumber ?? undefined,
    "Ratings Number": info?.ratingsNumber ?? undefined
  } as const;
}

export function ApplicationParameters({
  children,
  title = "Application Parameters",
  connection,
  isPlaceholder = false,
  containerProps,
  bodyProps,
  ...props
}: ApplicationParametersProps) {
  const [params, setParams] = useState<ReturnType<typeof createParams>>(() => createParams());
  const { isLoading, startLoading, stopLoading } = useTimeoutLoading({ delay: 400 });

  useEffect(() => {
    if (isPlaceholder) return;

    (async () => {
      try {
        startLoading();
        const res = await api.info.get({ connection });
        setParams(createParams(res.data));
      } catch (error) {
        setParams(createParams());
      } finally {
        stopLoading();
      }
    })();
  }, [connection, startLoading, stopLoading, isPlaceholder]);

  const content = Object.entries(params).map(([label, value]) => {
    let _value = (
      <Typography
        as="p"
        fontSize="md"
        lineHeight="base"
        fontWeight="semibold"
        textTransform="uppercase"
        borderRadius="md"
        bg="s2.gray.800"
        py="1"
        px="3"
        textAlign="right"
        flex="0 0 auto"
      >
        {value}
      </Typography>
    );

    if (typeof value !== "number" || isLoading || isPlaceholder) {
      _value = (
        <Skeleton
          w="20"
          h="8"
        />
      );
    }

    return (
      <Flex
        key={label}
        alignItems="center"
        justifyContent="space-between"
        flex="1 0 16rem"
        flexWrap="wrap"
        py="3"
        px="4"
        border="1px"
        borderColor="s2.gray.700"
        borderRadius="lg"
        gap="2"
      >
        <Typography
          as="h6"
          flex="1 0 auto"
          fontSize="sm"
          lineHeight="5"
          fontWeight="semibold"
        >
          {label}
        </Typography>

        {_value}
      </Flex>
    );
  });

  return (
    <Section
      variant="3.solid"
      title={title}
      {...props}
      containerProps={{ display: "flex", flexDirection: "column", h: "full", ...containerProps }}
      bodyProps={{
        flex: "1",
        display: "flex",
        flexWrap: "wrap",
        alignContent: "flex-start",
        justifyContent: "flex-start",
        gap: "4",
        borderTop: "1px",
        borderColor: "s2.gray.700",
        py: "4",
        px: "7",
        ...bodyProps
      }}
    >
      {content}
      {children}
    </Section>
  );
}
