import { useMemo } from "react";

import { Rating } from "@/types/api";
import { ComponentProps } from "@/types/common";

import { Rate, RateProps } from "@/components/common/Rate";

import { api } from "@/api";
import { userRatingsState } from "@/state/userRatings";
import { useTimeoutLoading } from "@/hooks/useTimeoutLoading";

export type ProductRateProps = ComponentProps<RateProps, { productId: Rating["productId"] }>;

export function ProductRate({ productId, onClick, ...props }: ProductRateProps) {
  const userRatings = userRatingsState.useValue();
  const setUserRatings = userRatingsState.setValue();

  const { isLoading, startLoading, stopLoading } = useTimeoutLoading();

  const isRated = useMemo(
    () => userRatings.find((rating) => rating.productId === productId),
    [productId, userRatings]
  );

  const handleClick: RateProps["onClick"] = async (value) => {
    try {
      startLoading();
      const res = await api.rating.create({ productId, value });
      setUserRatings((ratings) => [...ratings, res.data]);
    } finally {
      stopLoading();
    }

    onClick?.(value);
  };

  if (isRated) return null;

  return (
    <Rate
      {...props}
      isDisabled={isLoading}
      onClick={handleClick}
    />
  );
}
