import { ConnectionConfig } from "@/types/api";
import { apiInstance } from "./instance";

function get() {
  return apiInstance.get<ConnectionConfig>("/connection");
}

function create(body?: ConnectionConfig) {
  return apiInstance.post("/connection", body);
}

function update(body: ConnectionConfig) {
  return apiInstance.put("/connection", body);
}

export const connection = { get, create, update };
