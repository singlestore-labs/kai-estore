import { ApiParams, Rating } from "@/types/api";

import { apiInstance } from "./instance";

function create(body: Pick<Rating, "productId" | "value">, params?: ApiParams) {
  return apiInstance.post<Rating>("/rating", body, { params });
}

export const rating = { create };
