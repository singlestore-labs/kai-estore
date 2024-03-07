import { ApiParams } from "@/types/api";
import { apiInstance } from "./instance";

function setup(params?: ApiParams) {
  return apiInstance.post<boolean>("/cdc", undefined, { params });
}

export const cdc = { setup };
