import { AxiosRequestConfig } from "axios";

import { Order, Rating, RecommProduct, User, WithDuration } from "@/types/api";

import { apiInstance } from "./instance";

function create() {
  return apiInstance.post("/user");
}

function orders() {
  return apiInstance.get<Order[]>(`/user/orders`);
}

function ratings() {
  return apiInstance.get<Rating[]>(`/user/ratings`);
}

function recommProducts(config?: AxiosRequestConfig) {
  return apiInstance.get<WithDuration<RecommProduct[]>>(`/user/recomm-products`, config);
}

export const user = { create, orders, ratings, recommProducts };
