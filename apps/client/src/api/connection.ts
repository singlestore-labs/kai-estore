import { ApiParams, ConnectionConfig } from "@/types/api";
import { apiInstance } from "./instance";

function get(params?: ApiParams) {
  return apiInstance.get<ConnectionConfig>("/connection", { params });
}

function create(body?: ConnectionConfig, params?: ApiParams) {
  return apiInstance.post("/connection", body, { params });
}

function update(body: ConnectionConfig, params?: ApiParams) {
  return apiInstance.put("/connection", body, { params });
}

export const connection = { get, create, update };
