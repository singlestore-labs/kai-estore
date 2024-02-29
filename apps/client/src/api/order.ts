import { ApiParams, Order } from "@/types/api";

import { apiInstance } from "./instance";

function create(body: Pick<Order, "productIds">, params?: ApiParams) {
  return apiInstance.post("/order", body, { params });
}

export const order = { create };
