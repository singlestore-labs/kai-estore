import { Flex, FlexProps } from "@chakra-ui/react";

import { ComponentProps, UrlParams } from "@/types/common";

import { useSearchParams } from "@/hooks/useSearchParams";

import { Icon } from "./Icon";
import { Link, LinkProps } from "./Link";

export type PaginationProps = ComponentProps<
  FlexProps,
  {
    activePage?: number;
    pagesNumber: number;
    displayButtonsNumber?: number;
    isShallow?: boolean;
    shouldScroll?: boolean;
  }
>;

export function Pagination({
  activePage: initialActivePage = 1,
  pagesNumber,
  displayButtonsNumber = 3,
  isShallow = true,
  shouldScroll = true,
  ...props
}: PaginationProps) {
  const { paramsObject, createParamsURL } = useSearchParams<Pick<UrlParams, "page">>();

  if (!pagesNumber) return null;

  const activePage = Number(paramsObject.page || initialActivePage);
  const activeIndex = activePage - 1;
  const prevPage = activePage - 1;
  const nextPage = activePage + 1;
  const isFirstPage = activePage === 1;
  const isLastPage = activePage === pagesNumber;
  let buttonsNumber = Array.from({ length: pagesNumber }).map((_, i) => i + 1);

  if (isFirstPage) {
    buttonsNumber = buttonsNumber.slice(0, activeIndex + displayButtonsNumber);
  } else {
    const nextStart = activeIndex - 1;
    const nextEnd = activeIndex - 1 + displayButtonsNumber;
    let start = nextStart;
    start = nextStart + displayButtonsNumber > pagesNumber ? pagesNumber - displayButtonsNumber : start;
    start = start < 0 ? 0 : start;
    const end = nextEnd > pagesNumber ? pagesNumber : nextEnd;
    buttonsNumber = buttonsNumber.slice(start, end);
  }

  const linksProps: Partial<LinkProps> = { shallow: isShallow, scroll: shouldScroll };

  const buttons = buttonsNumber.map((page) => (
    <Link
      key={page}
      href={createParamsURL({ page: page.toString() })}
      chakra={{ variant: "outline.secondary", className: page === activePage ? "isActive" : "" }}
      {...linksProps}
    >
      {page}
    </Link>
  ));

  return (
    <Flex alignItems="center" justifyContent="flex-start" gap="2.5" {...props}>
      <Link
        href={createParamsURL({ page: prevPage.toString() })}
        chakra={{ variant: "ghost", display: "flex", h: "10" }}
        disabled={isFirstPage}
        {...linksProps}
      >
        <Icon name="solid.faChevronLeft" w="2" />
      </Link>

      {buttons}

      <Link
        href={createParamsURL({ page: nextPage.toString() })}
        chakra={{ variant: "ghost", display: "flex", h: "10" }}
        disabled={isLastPage}
        {...linksProps}
      >
        <Icon name="solid.faChevronRight" w="2" />
      </Link>
    </Flex>
  );
}
