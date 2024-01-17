import { Order } from "@/types/api";

import { apiInstance } from "./instance";

function create(body: Pick<Order, "productIds">) {
  return apiInstance.post("/order", body);
}

export const order = { create };
