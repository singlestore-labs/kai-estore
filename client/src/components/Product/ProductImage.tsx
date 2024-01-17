import { Box, BoxProps } from "@chakra-ui/react";
import Image, { ImageProps } from "next/image";

import { ComponentProps } from "@/types/common";

import { SERVER_URL } from "@/constants/env";

import { defaultProductImage } from "@/data";

export type ProductImageProps = ComponentProps<
  BoxProps,
  {
    src: ImageProps["src"];
    alt: ImageProps["alt"];
    ratio?: number;
    imageProps?: Omit<ImageProps, "src" | "alt">;
  }
>;

export function ProductImage({
  children,
  src: initialSrc,
  alt,
  ratio = 100,
  imageProps,
  ...props
}: ProductImageProps) {
  const src = `${SERVER_URL}${initialSrc}` || defaultProductImage;

  return (
    <Box
      position="relative"
      w="full"
      overflow="hidden"
      {...props}
      __css={{
        ...props?.__css,
        "& .image": {
          transition: "all 0.2s ease",
          objectFit: "cover",
          zIndex: "1",
        },
      }}
    >
      <Box display="block" pt={`${ratio}%`} pointerEvents="none" />

      <Image
        className="image"
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        {...imageProps}
      />

      {children}
    </Box>
  );
}
