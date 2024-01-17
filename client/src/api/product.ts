import { AxiosRequestConfig } from "axios";

import {
  Category,
  Product,
  RelatedProduct,
  WithDuration,
  SalesProduct,
  Tag,
  TopProduct,
  TrendingProduct,
} from "@/types/api";

import { SortParam } from "@/types/common";

import { apiInstance } from "./instance";

function byItemId(id: Product["id"]) {
  return apiInstance.get<WithDuration<Product>>(`/product/${id}`);
}

function filter(params?: {
  category?: Category["id"][];
  tag?: Tag["id"][];
  price?: string[];
  rating?: string[];
  page?: string;
  sort?: SortParam;
}) {
  return apiInstance.get<WithDuration<{ products: Product[]; total: number }>>("/products/filter", {
    params,
  });
}

function prices() {
  return apiInstance.get<Product["price"][]>("/products/prices");
}

function ratings() {
  return apiInstance.get<Product["rating"][]>("/products/ratings");
}

function top(params?: { number?: string }, config?: AxiosRequestConfig) {
  return apiInstance.get<WithDuration<TopProduct[]>>("/products/top", { ...config, params });
}

function topOne() {
  return apiInstance.get<WithDuration<TopProduct[]>>("/products/top?number=1");
}

function trending(params?: { from?: string | Date; number?: string }, config?: AxiosRequestConfig) {
  return apiInstance.get<WithDuration<TrendingProduct[]>>("/products/trending", {
    ...config,
    params,
  });
}

function sales(id: Product["id"], params?: { sample?: boolean }, config?: AxiosRequestConfig) {
  return apiInstance.get<WithDuration<SalesProduct[]>>(`/product/${id}/sales`, {
    ...config,
    params,
  });
}

function relatedProducts(id: Product["id"], params?: { sample?: boolean }, config?: AxiosRequestConfig) {
  return apiInstance.get<WithDuration<RelatedProduct[]>>(`/product/${id}/related-products`, {
    ...config,
    params,
  });
}

export const product = {
  byItemId,
  filter,
  prices,
  ratings,
  top,
  topOne,
  trending,
  sales,
  relatedProducts,
};
