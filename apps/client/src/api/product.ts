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
  ApiParams
} from "@/types/api";

import { SortParam } from "@/types/common";

import { apiInstance } from "./instance";

function byItemId(id: Product["id"], params?: ApiParams) {
  return apiInstance.get<WithDuration<Product>>(`/product/${id}`, { params });
}

function filter(
  params?: ApiParams<{
    category?: Category["id"][];
    tag?: Tag["id"][];
    price?: string[];
    rating?: string[];
    page?: string;
    sort?: SortParam;
  }>,
  config?: AxiosRequestConfig
) {
  return apiInstance.get<WithDuration<{ products: Product[]; total: number }>>("/products/filter", {
    ...config,
    params
  });
}

function prices(params?: ApiParams) {
  return apiInstance.get<Product["price"][]>("/products/prices", { params });
}

function ratings(params?: ApiParams) {
  return apiInstance.get<Product["rating"][]>("/products/ratings", { params });
}

function top(params?: ApiParams<{ number?: string }>, config?: AxiosRequestConfig) {
  return apiInstance.get<WithDuration<TopProduct[]>>("/products/top", { ...config, params });
}

function topOne(params?: ApiParams, config?: AxiosRequestConfig) {
  return apiInstance.get<WithDuration<TopProduct[]>>("/products/top?number=1", { ...config, params });
}

function topOneSales(params?: ApiParams, config?: AxiosRequestConfig) {
  return apiInstance.get<WithDuration<SalesProduct[]>>(`/products/top/sales`, { ...config, params });
}

function trending(params?: ApiParams<{ from?: string | Date; number?: string }>, config?: AxiosRequestConfig) {
  return apiInstance.get<WithDuration<TrendingProduct[]>>("/products/trending", {
    ...config,
    params
  });
}

function sales(id: Product["id"], params?: ApiParams<{ sample?: boolean }>, config?: AxiosRequestConfig) {
  return apiInstance.get<WithDuration<SalesProduct[]>>(`/product/${id}/sales`, {
    ...config,
    params
  });
}

function relatedProducts(
  id: Product["id"],
  params?: ApiParams<{ sample?: boolean }>,
  config?: AxiosRequestConfig
) {
  return apiInstance.get<WithDuration<RelatedProduct[]>>(`/product/${id}/related-products`, {
    ...config,
    params
  });
}

export const product = {
  byItemId,
  filter,
  prices,
  ratings,
  top,
  topOne,
  topOneSales,
  trending,
  sales,
  relatedProducts
};
