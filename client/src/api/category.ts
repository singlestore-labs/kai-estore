import { Category } from "@/types/api";

import { apiInstance } from "./instance";

function getMany() {
  return apiInstance.get<Category[]>("/categories");
}

export const category = { getMany };
