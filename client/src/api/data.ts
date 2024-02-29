import { ApiParams } from "@/types/api";
import { apiInstance } from "./instance";

function validate(params?: ApiParams) {
  return apiInstance.get<boolean>("/data/validate", { params });
}

function set(params?: ApiParams) {
  return apiInstance.post<boolean>("/data/set", undefined, { params });
}

function reset(params?: ApiParams) {
  return apiInstance.post("/data/set", undefined, { params: { ...params, force: true } });
}

export const data = { validate, set, reset };
