import { Override } from "./helpers";

export type SortParam = "date" | "sales" | "price-asc" | "price-desc";

export type UrlParams = {
  product?: string;
  search?: string;
  page?: string;
  category?: string;
  tag?: string;
  price?: string;
  rating?: string;
  sort?: SortParam;
  checkout?: "1" | "";
  cart?: "1" | "";
};

export type ComponentProps<T extends object = object, K extends object = object> = Override<T, K>;
