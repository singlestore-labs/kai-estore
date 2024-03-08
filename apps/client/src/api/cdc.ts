import { ApiParams, CDC } from "@/types/api";
import { apiInstance } from "./instance";

function setup(params?: ApiParams) {
  return apiInstance.post<boolean>("/cdc", undefined, { params });
}

function get(params?: ApiParams) {
  return apiInstance.get<CDC>("/cdc", { params });
}

export const cdc = { setup, get };
