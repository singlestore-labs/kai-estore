import { DbInfo } from "@/types/api";

import { apiInstance } from "./instance";

function get() {
  return apiInstance.get<DbInfo>("/info");
}

export const info = { get };
