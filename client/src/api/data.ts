import { apiInstance } from "./instance";

function validate() {
  return apiInstance.get<boolean>("/data/validate");
}

function set() {
  return apiInstance.post<boolean>("/data/set");
}

function reset() {
  return apiInstance.post("/data/set", {}, { params: { force: true } });
}

export const data = { validate, set, reset };
