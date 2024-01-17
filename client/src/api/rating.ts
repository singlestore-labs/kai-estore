import { Rating } from "@/types/api";

import { apiInstance } from "./instance";

function create(body: Pick<Rating, "productId" | "value">) {
  return apiInstance.post<Rating>("/rating", body);
}

export const rating = { create };
