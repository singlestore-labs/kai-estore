import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Box,
  Button,
  CloseButton,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
  useDisclosure
} from "@chakra-ui/react";

import { ComponentProps } from "@/types/common";

import { Typography } from "@/components/common/Typography";

import { cookies } from "@/utils/cookies";

import { Logo } from "./Logo";

import { welcomeTabs } from "@/data";

export type WelcomeModalProps = ComponentProps<Omit<ModalProps, "children" | "isOpen" | "onClose">>;

const tabs = welcomeTabs;

export function WelcomeModal({ ...props }: WelcomeModalProps) {
  const { onOpen, ...modal } = useDisclosure();
  const [tabIndex, setTabIndex] = useState(0);
  const tab = tabs[tabIndex];
  const isFirstTab = tabIndex === 0;
  const isLastTab = tabIndex + 1 === tabs.length;
  const isViewed = cookies.get("welcome") === "1";

  const handleClose = () => {
    cookies.set("welcome", "1");
    modal.onClose();
  };

  useEffect(() => {
    if (!isViewed) onOpen();
  }, [isViewed, onOpen]);

  const dots = (
    <Flex gap="3">
      {tabs.map((tab, i) => (
        <Button
          key={tab.title}
          variant="unstyled"
          size="none"
          display="block"
          bg={tabIndex === i ? "s2.purple.800" : "s2.gray.200"}
          w="3"
          h="3"
          borderRadius="full"
          onClick={() => setTabIndex(i)}
        />
      ))}
    </Flex>
  );

  return (
    <Modal
      size="s2.md"
      isCentered
      motionPreset="slideInBottom"
      {...props}
      isOpen={modal.isOpen}
      autoFocus={false}
      onClose={handleClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody
          position="relative"
          w="full"
          maxW="full"
          p="0"
        >
          <Box
            display="block"
            pt="46.11%"
            pointerEvents="none"
          />

          <Flex
            position="absolute"
            top="0"
            left="0"
            alignItems="flex-start"
            justifyContent="flex-start"
            flexWrap="wrap"
            w="full"
            h="full"
            p="6"
            gap="9"
            overflow="hidden"
          >
            <Flex
              position="relative"
              flex="1"
              flexDirection="column"
              maxW="440px"
              h="full"
            >
              <Flex
                w="full"
                maxW="full"
                alignItems="center"
                justifyContent="space-between"
              >
                <Logo
                  w={8}
                  h={8}
                  variant="s2.small"
                />
                <CloseButton onClick={handleClose} />
              </Flex>

              <Flex
                color="s2.gray.900"
                flex="1"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                pb="5%"
                overflowX="hidden"
                overflowY="auto"
              >
                <Typography
                  as="h2"
                  fontSize="2xl"
                  lineHeight="8"
                  fontWeight="semibold"
                >
                  {tab.title}
                </Typography>
                <Typography
                  as="p"
                  fontSize="md"
                  lineHeight="6"
                  fontWeight="normal"
                  mt="2"
                >
                  {tab.text}
                </Typography>
              </Flex>

              <Flex
                alignItems="center"
                justifyContent="space-between"
              >
                {dots}

                <Flex
                  alignItems="center"
                  justifyContent="flex-start"
                  gap="3"
                >
                  <Button
                    variant="solid.secondary"
                    size="s2.md"
                    borderRadius="full"
                    px="7"
                    onClick={() => setTabIndex((index) => index - 1)}
                    isDisabled={isFirstTab}
                  >
                    Back
                  </Button>

                  <Button
                    variant="solid"
                    size="s2.md"
                    borderRadius="full"
                    px="7"
                    autoFocus
                    onClick={() => (isLastTab ? handleClose() : setTabIndex((index) => index + 1))}
                  >
                    {isLastTab ? "Done" : "Next"}
                  </Button>
                </Flex>
              </Flex>
            </Flex>

            <Flex
              flex="1"
              position="relative"
              maxW="full"
              overflow="hidden"
              __css={{
                "& .image": {
                  objectFit: "cover"
                }
              }}
            >
              <Box
                display="block"
                pt="80.93%"
                pointerEvents="none"
              />
              <Image
                className="image"
                src={tab.image}
                alt={tab.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
