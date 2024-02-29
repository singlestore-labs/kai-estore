import { AxiosRequestConfig } from "axios";

import { ApiParams, Order, Rating, RecommProduct, WithDuration } from "@/types/api";

import { apiInstance } from "./instance";

function create(params?: ApiParams) {
  return apiInstance.post("/user", undefined, { params });
}

function orders(params?: ApiParams) {
  return apiInstance.get<Order[]>(`/user/orders`, { params });
}

function ratings(params?: ApiParams) {
  return apiInstance.get<Rating[]>(`/user/ratings`, { params });
}

function recommProducts(config?: AxiosRequestConfig, params?: ApiParams) {
  return apiInstance.get<WithDuration<RecommProduct[]>>(`/user/recomm-products`, { ...config, params });
}

export const user = { create, orders, ratings, recommProducts };
