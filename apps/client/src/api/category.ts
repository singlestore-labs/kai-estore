import { ApiParams, Category } from "@/types/api";

import { apiInstance } from "./instance";

function getMany(params?: ApiParams) {
  return apiInstance.get<Category[]>("/categories", { params });
}

export const category = { getMany };
