import { ApiParams, DbInfo } from "@/types/api";

import { apiInstance } from "./instance";

function get(params?: ApiParams) {
  return apiInstance.get<DbInfo>("/info", { params });
}

export const info = { get };
