import { RecommProduct } from "@/types/api";
import { createState } from "@/utils/state";

export type UserRecommProductsState = RecommProduct[];

export const userRecommProductsState = createState<UserRecommProductsState>("userRecommProductsState", [], {
  default: [],
});
