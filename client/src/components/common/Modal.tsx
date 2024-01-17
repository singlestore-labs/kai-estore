import { ReactNode } from "react";
import {
  Modal as ChakraModal,
  ModalProps as ChakraModalProps,
  ModalBody,
  ModalBodyProps,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalOverlayProps,
} from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

export type ModalProps = ComponentProps<
  ChakraModalProps,
  {
    children?: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    overlayProps?: ModalOverlayProps;
    contentProps?: Omit<ModalContentProps, "children">;
    bodyProps?: Omit<ModalBodyProps, "children">;
  }
>;

export function Modal({
  children,
  header,
  footer,
  overlayProps,
  contentProps,
  bodyProps,
  ...props
}: ModalProps) {
  let _header;
  if (header) {
    _header = <ModalHeader>{header}</ModalHeader>;
  }

  let _footer;
  if (footer) {
    _footer = <ModalFooter>{footer}</ModalFooter>;
  }

  return (
    <ChakraModal motionPreset="slideInBottom" {...props}>
      <ModalOverlay {...overlayProps} />
      <ModalContent {...contentProps}>
        {_header}
        <ModalCloseButton />
        <ModalBody {...bodyProps}>{children}</ModalBody>
        {_footer}
      </ModalContent>
    </ChakraModal>
  );
}
