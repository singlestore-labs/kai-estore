import NextHead from "next/head";

import { APP_DESCRIPTION, APP_TITLE } from "@/constants/common";

export type HeadProps = { title?: string; description?: string };

export function Head({ title = APP_TITLE, description = APP_DESCRIPTION }: HeadProps) {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </NextHead>
  );
}
