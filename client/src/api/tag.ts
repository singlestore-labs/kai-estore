import { ApiParams, Tag } from "@/types/api";

import { apiInstance } from "./instance";

function getMany(params?: ApiParams) {
  return apiInstance.get<Tag[]>("/tags", { params });
}

export const tag = { getMany };
